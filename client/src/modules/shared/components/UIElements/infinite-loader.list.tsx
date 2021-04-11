import React, { useEffect, useRef } from 'react';
import {
    AutoSizer,
    List as VirtualizedList,
    ListRowProps,
    CellMeasurer,
    CellMeasurerCache,
    InfiniteLoader,
    Index,
    ListProps
} from 'react-virtualized';

export interface ListItem {
    default: JSX.Element;
    onScroll: JSX.Element;
}

interface InfiniteListProps {
    hasNextPage: boolean;
    isNextPageLoading: boolean;
    list: ListItem[];
    batchSize?: number;
    scrollToIndex: ListProps['scrollToIndex'];
    scrollToAlignment: ListProps['scrollToAlignment'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadNextPage: () => Promise<any>;
}

const cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 100,
    keyMapper: rowIndex => listIds[rowIndex - 1]
});

let listIds: string[] = [];

const InfiniteList: React.FC<InfiniteListProps> = ({
    hasNextPage,
    isNextPageLoading,
    list,
    loadNextPage,
    scrollToIndex
}) => {
    const infiniteLoaderRef = useRef<InfiniteLoader>();
    const listRef = useRef<VirtualizedList>();

    useEffect(() => {
        listIds = list.map(l => l.default?.props?.message?.id);
    }, [list]);

    useEffect(() => {
        listRef.current?.recomputeRowHeights();
    }, [list.length]);

    // console.log('infinite List scroll index ' + scrollToIndex);

    const rowRenderer: React.FC<ListRowProps> = ({
        index,
        style,
        key,
        parent,
        isScrolling
    }) => {
        const getRowItem = () => {
            if (!isRowLoaded({ index })) {
                return <span>Loading...</span>;
            }

            const listItem = list[index];

            try {
                if (isScrolling) return listItem.onScroll;
                return listItem.default;
            } catch (e) {
                console.error(`index ${index}`);
            }
        };

        return (
            <CellMeasurer
                cache={cache}
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

    const rowCount = hasNextPage ? list.length + 1 : list.length;

    const isRowLoaded = ({ index }: Index) => {
        if (!hasNextPage) return true;
        return index < list.length;
    };
    const loadMoreRows = () => {
        if (isNextPageLoading) return new Promise(() => null);
        return loadNextPage();
    };

    return (
        <AutoSizer>
            {({ height, width }) => (
                <InfiniteLoader
                    isRowLoaded={isRowLoaded}
                    minimumBatchSize={50}
                    loadMoreRows={loadMoreRows}
                    rowCount={rowCount}
                    ref={infiniteLoaderRef}
                >
                    {({ onRowsRendered, registerChild }) => (
                        <VirtualizedList
                            ref={el => {
                                listRef.current = el;
                                registerChild(el);
                            }}
                            scrollToIndex={scrollToIndex}
                            onRowsRendered={onRowsRendered}
                            height={height}
                            rowCount={rowCount}
                            width={width}
                            estimatedRowSize={100}
                            rowRenderer={rowRenderer}
                            deferredMeasurementCache={cache}
                            rowHeight={cache.rowHeight}
                        />
                    )}
                </InfiniteLoader>
            )}
        </AutoSizer>
    );
};

InfiniteList.defaultProps = {
    batchSize: 50,
    scrollToIndex: -1
};

InfiniteList.displayName = 'InfiniteList';

export default InfiniteList;
