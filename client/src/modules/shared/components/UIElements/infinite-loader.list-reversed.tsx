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

export interface ListItem {
    id: string;
    component: JSX.Element;
}

export interface InfiniteLoaderListProps {
    hasNextPage: boolean;
    isNextPageLoading: boolean;
    batchSize?: number;
    list: ListItem[];
    loadNextPage: () => Promise<any>;
    setListRef?: (el: VirtualizedList) => void;
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
        setListRef,
        batchSize
    }) => {
        const listIds = useRef([]);
        const cache = useRef(
            new CellMeasurerCache({
                fixedWidth: true,
                minHeight: 31,
                keyMapper: rowIndex => listIds.current?.[rowIndex]
            })
        );
        const infiniteLoaderRef = useRef<InfiniteLoader>();
        const setListIds = useCallback(() => {
            listIds.current = list.map(l => l.id);
        }, [list]);

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
            parent
        }) => {
            const getRowItem = () => {
                if (isNextPageLoading && index === 0) {
                    return (
                        <StyledLoading>
                            <CircularProgress size={24} />
                        </StyledLoading>
                    );
                }

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
                setTimeout(() => {
                    setAllowLoadMore(true);
                }, [300]);
            }
        }, [isNextPageLoading]);

        const onListScroll = useCallback(
            ({ scrollTop }: OnScrollParams) => {
                if (!allowLoadMore) return;

                if (scrollTop === 0) {
                    setAllowLoadMore(false);
                    loadMoreRows();
                }
            },
            [allowLoadMore, loadMoreRows]
        );

        const debouncedScroll = debounce(onListScroll, 150);

        return (
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
                                    setListRef(el);
                                    registerChild(el);
                                }}
                                onRowsRendered={onRowsRendered}
                                height={height}
                                onScroll={debouncedScroll}
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
        );
    }
);

const StyledLoading = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

InfiniteListReversed.defaultProps = {
    setListRef: () => null,
    batchSize: 50
};

InfiniteListReversed.displayName = 'InfiniteListReversed';

export default InfiniteListReversed;
