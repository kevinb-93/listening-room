import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
    AutoSizer,
    List as VirtualizedList,
    ListRowProps,
    CellMeasurer,
    CellMeasurerCache,
    InfiniteLoader,
    OnScrollParams,
    ListProps,
    InfiniteLoaderProps
} from 'react-virtualized';
import debounce from 'lodash/debounce';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { IconButton } from '@material-ui/core';

export interface ListItem {
    id: string;
    component: JSX.Element;
}

export interface InfiniteLoaderListProps {
    hasNextPage: boolean;
    isNextPageLoading: boolean;
    batchSize?: number;
    onListScroll?: (isScrolledBottom: boolean) => void;
    list: ListItem[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadNextPage: () => Promise<any>;
    setListRef?: (el: VirtualizedList) => void;
    onRowVisible?: (index: number) => void;
    unreadItems?: number;
}

interface InfiniteListReversedProps extends InfiniteLoaderListProps {
    infiniteLoaderProps?: Partial<InfiniteLoaderProps>;
    virtualListProps?: Partial<ListProps>;
}

const InfiniteListReversed: React.FC<InfiniteListReversedProps> = memo(
    ({
        hasNextPage,
        isNextPageLoading,
        list,
        loadNextPage,
        infiniteLoaderProps,
        virtualListProps,
        setListRef = () => null,
        batchSize = 50,
        onListScroll,
        onRowVisible = () => null,
        unreadItems = 0
    }) => {
        const listIds = useRef<string[]>([]);
        const cache = useRef(
            new CellMeasurerCache({
                fixedWidth: true,
                minHeight: 31,
                keyMapper: rowIndex => listIds.current?.[rowIndex]
            })
        );
        const infiniteLoaderRef = useRef<InfiniteLoader>(null);
        const setListIds = useCallback(() => {
            listIds.current = list.map(l => l.id);
        }, [list]);
        const listRef = useRef<VirtualizedList>();
        const scrollHeightRef = useRef<number>();
        const [showScrollBottom, setShowScrollBottom] = useState(false);

        useEffect(
            function onListChangeEffect() {
                setListIds();
                cache.current?.clearAll();
            },
            [list.length, setListIds]
        );

        const rowRenderer: React.FC<ListRowProps> = ({
            index,
            style,
            key,
            parent,
            isVisible
        }) => {
            const getRowItem = () => {
                if (isNextPageLoading && index === 0) {
                    return (
                        <StyledLoading>
                            <CircularProgress size={24} />
                        </StyledLoading>
                    );
                }

                if (isVisible) onRowVisible(index);

                const listIndex = isNextPageLoading ? index - 1 : index;
                const listItem = list[listIndex];

                try {
                    return listItem.component;
                } catch (e) {
                    console.error(`index ${index}`);
                }
            };

            return (
                <CellMeasurer
                    cache={cache.current}
                    columnIndex={0}
                    key={key}
                    parent={parent}
                    rowIndex={index}
                >
                    {({ measure }) => (
                        <div onLoad={measure} key={key} style={style}>
                            {getRowItem()}
                        </div>
                    )}
                </CellMeasurer>
            );
        };

        const rowCount = isNextPageLoading ? list.length + 1 : list.length;

        const isRowLoaded = () => true;

        const loadMoreRows = useCallback(() => {
            if (isNextPageLoading || !hasNextPage)
                return new Promise(() => null);
            return loadNextPage();
        }, [hasNextPage, isNextPageLoading, loadNextPage]);

        const [allowLoadMore, setAllowLoadMore] = useState(hasNextPage);

        useEffect(() => {
            if (!isNextPageLoading) {
                window.setTimeout(() => {
                    setAllowLoadMore(true);
                }, 300);
            }
        }, [isNextPageLoading]);

        const scrollHandler = useCallback(
            ({ scrollTop, clientHeight, scrollHeight }: OnScrollParams) => {
                const scrollBottom = getScrollBottom({
                    scrollTop,
                    scrollHeight,
                    clientHeight
                });
                scrollHeightRef.current = scrollHeight;
                const isScrolledBottom = scrollBottom === 0;
                setShowScrollBottom(!isScrolledBottom);
                if (onListScroll) onListScroll(isScrolledBottom);

                if (!allowLoadMore) return;

                if (scrollTop === 0) {
                    setAllowLoadMore(false);
                    loadMoreRows();
                }
            },
            [allowLoadMore, loadMoreRows, onListScroll]
        );

        const debouncedScrollHandler = debounce(scrollHandler, 150);

        const scrollBottomClickHandler = () => {
            listRef.current?.scrollToPosition(scrollHeightRef.current);
        };

        return (
            <>
                <AutoSizer>
                    {({ height, width }) => (
                        <InfiniteLoader
                            isRowLoaded={isRowLoaded}
                            minimumBatchSize={batchSize}
                            loadMoreRows={loadMoreRows}
                            rowCount={rowCount}
                            ref={infiniteLoaderRef}
                            {...infiniteLoaderProps}
                        >
                            {({ onRowsRendered, registerChild }) => (
                                <VirtualizedList
                                    ref={el => {
                                        listRef.current = el ?? undefined;
                                        if (el) setListRef(el);
                                        registerChild(el);
                                    }}
                                    onRowsRendered={onRowsRendered}
                                    height={height}
                                    onScroll={debouncedScrollHandler}
                                    rowCount={rowCount}
                                    width={width}
                                    estimatedRowSize={31}
                                    rowRenderer={rowRenderer}
                                    deferredMeasurementCache={cache.current}
                                    rowHeight={cache.current?.rowHeight}
                                    {...virtualListProps}
                                />
                            )}
                        </InfiniteLoader>
                    )}
                </AutoSizer>
                {showScrollBottom && (
                    <StyledScrollBottomButtonContainer>
                        <StyledScrollBottomButton
                            onClick={scrollBottomClickHandler}
                        >
                            <ArrowDownwardIcon
                                color="secondary"
                                fontSize="large"
                            />
                            {unreadItems > 0 && unreadItems}
                        </StyledScrollBottomButton>
                    </StyledScrollBottomButtonContainer>
                )}
            </>
        );
    }
);

const getScrollBottom = ({
    scrollHeight,
    scrollTop,
    clientHeight
}: Pick<OnScrollParams, 'clientHeight' | 'scrollTop' | 'scrollHeight'>) => {
    return scrollHeight - scrollTop - clientHeight;
};

const StyledLoading = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

const StyledScrollBottomButton = styled(IconButton)`
    background-color: blue;
`;

const StyledScrollBottomButtonContainer = styled.div`
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
`;

InfiniteListReversed.displayName = 'InfiniteListReversed';

export default InfiniteListReversed;
