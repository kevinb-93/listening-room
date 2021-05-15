import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import HttpError from '../../shared/models/http-error.model';
import User, { UserRole } from './user.model';
import { isPasswordValid } from '../../shared/utils/password';
import RefreshTokenModel from './token/token.refresh.model';
import { RefreshToken } from './token/token.refresh';
import { AccessToken } from './token/token.access';

export interface RegisterDetails {
    username: string;
    password: string;
    isAnonymous: string;
}

export class UserService {
    static async authenticate(username: string, password: string) {
        const user = await User.findOne({ name: username });
        if (!user) {
            throw new HttpError('Invalid username or password!', 401);
        }

        const isValidPassword = await isPasswordValid(password, user.password);
        if (!isValidPassword) {
            throw new HttpError('Invalid username or password!', 401);
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        const accessToken = await user.createAccessToken();
        await user.save({ session });

        const refreshToken = new RefreshToken(user._id, 'ip');
        const newRefreshTokenDoc = new RefreshTokenModel(
            refreshToken.signedPayload
        );
        await newRefreshTokenDoc.save({ session });
        session.commitTransaction();

        return { accessToken, refreshToken: newRefreshTokenDoc.token };
    }

    static async register({
        username,
        password,
        isAnonymous
    }: RegisterDetails) {
        let hashedPassword = '';
        if (!isAnonymous) {
            const user = await User.findOne({ name: username });
            if (user) {
                throw new HttpError('Username already taken!', 409);
            }

            hashedPassword = await bcrypt.hash(password, 12);
        }

        const newUser = new User({
            name: username,
            password: isAnonymous ? password : hashedPassword,
            lastLoginAt: new Date(),
            isAnonymous,
            role: isAnonymous ? null : UserRole.User
        });

        const session = await mongoose.startSession();
        session.startTransaction();
        const accessToken = await newUser.createAccessToken();
        await newUser.save();

        const refreshToken = new RefreshToken(newUser._id, 'ip');
        const newRefreshTokenDoc = new RefreshTokenModel(
            refreshToken.signedPayload
        );
        await newRefreshTokenDoc.save({ session });
        session.commitTransaction();

        return {
            user: newUser,
            accessToken,
            refreshToken: refreshToken.signedPayload.token
        };
    }

    static async refreshTokens(refreshToken: string, ipAddress: string) {
        const existingRefreshToken = await RefreshTokenModel.findOne({
            token: refreshToken
        }).populate('user');

        if (!existingRefreshToken) throw new HttpError('Token not found!', 401);

        if (
            !existingRefreshToken?.isActive ||
            !(existingRefreshToken.user instanceof User)
        )
            throw new HttpError('Invalid token!', 401);

        const newRefreshToken = new RefreshToken(
            existingRefreshToken.user,
            ipAddress
        );
        const newRefreshTokenDoc = new RefreshTokenModel(
            newRefreshToken.signedPayload
        );
        existingRefreshToken.revoked = new Date();
        existingRefreshToken.revokedByIp = ipAddress;
        existingRefreshToken.replacedByToken =
            newRefreshToken.signedPayload.token;
        await existingRefreshToken.save();
        await newRefreshTokenDoc.save();

        const accessToken = new AccessToken({
            userId: existingRefreshToken.user._id,
            name: existingRefreshToken.user.name,
            role: existingRefreshToken.user.role
        });

        return {
            user: existingRefreshToken.user,
            accessToken: accessToken.signedPayload,
            refreshToken: newRefreshToken.signedPayload.token
        };
    }

    static async logout(userId: string) {
        await RefreshTokenModel.deleteMany({
            user: userId
        });
    }

    static async getUser(userId: string) {
        const userDoc = await User.findById(userId);

        if (!userDoc) {
            throw new HttpError('No user found!', 404);
        }

        return { userDoc };
    }
}
