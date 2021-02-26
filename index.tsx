import * as React from 'react';
import {
  VirtualizedList,
  FlatListProps,
  ViewStyle,
  View,
  LayoutChangeEvent,
  ViewToken,
} from 'react-native';

export interface WaterFallListProps<ItemT> extends FlatListProps<ItemT> {
  getHeight: (n: ItemT,index:number) => number;
  listStyle?: ViewStyle | null;
  initialScrollY?: number;
  needItemLayout?: boolean;
}

interface Column<ItemT> {
  data: Array<ItemT>;
  index: number;
  totalHeight: number;
  heights: number[];
  dataIndexs: number[];
  offsets: number[];
}

interface WaterFallListState<ItemT> {
  data: Array<ItemT>;
  columns: Column<ItemT>[];
}

interface ColumnData<ItemT> {
  data: Array<ItemT>;
  index: number;
  totalHeight: number;
  heights: number[];
}

class WaterFallList<ItemT> extends React.Component<
  WaterFallListProps<ItemT>,
  WaterFallListState<ItemT>
  > {
  static defaultProps = {
    initialScrollY: 0,
    needItemLayout: true,
  };

  _scrollRef?: VirtualizedList<ItemT> | null;

  constructor(props: WaterFallListProps<ItemT>) {
    super(props);
    this.state = {
      data: [],
      columns: [],
    };
  }

  static getDerivedStateFromProps(props: WaterFallListProps<any>) {
    const { data, numColumns = 1 } = props;
    const columns: Column<any>[] = Array.from({
      length: numColumns,
    }).map((col, i) => ({
      index: i,
      totalHeight: 0,
      data: [],
      heights: [],
      dataIndexs: [],
      offsets: [],
    }));
    data!.forEach((item, index) => {
      const _height = props.getHeight(item, index);
      const column = columns.reduce(
        (prev, cur) => (cur.totalHeight < prev.totalHeight ? cur : prev),
        columns[0],
      );
      column.data.push({
        ...item,
      });
      column.dataIndexs.push(index);
      column.offsets.push(column.totalHeight);
      column.heights.push(_height);
      column.totalHeight += _height;
    });
    return { columns };
  }

  _getItemCount = (data: ItemT[]) => (data && data.length) || 0;

  _getItem = (data: ItemT[], index: number) => data[index];

  _defaultRenderScrollComponent = (props: WaterFallListProps<ItemT>) => {
    return <VirtualizedList {...props} />;
  };

  _onViewableItemsChanged = (
    info: {
      viewableItems: Array<ViewToken>;
      changed: Array<ViewToken>;
    },
    columnIndex: number,
  ) => {
    const { viewableItems, changed } = info;
    this.props.onViewableItemsChanged &&
      this.props.onViewableItemsChanged({
        viewableItems: viewableItems.map((data) => ({
          ...data,
          index: this.state.columns[columnIndex].dataIndexs[
            data.index as number
          ],
        })),
        changed: changed.map((data) => ({
          ...data,
          index: this.state.columns[columnIndex].dataIndexs[
            data.index as number
          ],
        })),
      });
  };

  renderWaterFall = () => {
    const {
      data = [],
      ListHeaderComponent,
      ListEmptyComponent,
      ListFooterComponent,
      listStyle,
      onEndReachedThreshold,
      onEndReached,
      contentContainerStyle,
      renderItem,
      getHeight,
      needItemLayout,
      ...reset
    } = this.props;
    // console.log(data.length);

    let emptyElement = null;
    if (ListEmptyComponent) {
      emptyElement = React.isValidElement(ListEmptyComponent) ? (
        ListEmptyComponent
      ) : (
          <ListEmptyComponent />
        );
    }
    if (data === null || data.length === 0) {
      return emptyElement;
    }
    console.log(this.state.columns);
    return (
      <View
        key="$container"
        style={[{ flex: 1, flexDirection: 'row' }, listStyle]}>
        {this.state.columns.map((column, columnIndex) => (
          <VirtualizedList
            style={{ flex: 1 }}
            {...reset}
            renderItem={({ item, index, ...params }) => renderItem({ item, index: this.state.columns[columnIndex].dataIndexs[index], ...params })}
            getItem={this._getItem}
            contentContainerStyle={{ backgroundColor: 'green' }}
            data={column.data}
            key={`$column-${columnIndex}`}
            listKey={`$column-${columnIndex}`}
            getItemCount={this._getItemCount}
            onScroll={() => { }}
            getItemLayout={(...p) => this._getItemLayout(...p, columnIndex)}
            onViewableItemsChanged={(e) =>
              this._onViewableItemsChanged(e, columnIndex)
            }
            initialScrollIndex={undefined}
          />
        ))}
      </View>
    );
  };

  _getItemLayout = (data: any, index: number, columnIndex: number) => {
    const columnData = this.state.columns[columnIndex];
    return {
      length: columnData.heights[index],
      offset: columnData.offsets[index],
      index,
    };
  };

  _onLayout = (e: LayoutChangeEvent) => {
    if (this.props.initialScrollY && this._scrollRef) {
      this._scrollRef.scrollToOffset({
        offset: this.props.initialScrollY,
        animated: false,
      });
    }
    this.props.onLayout && this.props.onLayout(e);
  };

  createRef = (ref: VirtualizedList<ItemT> | null) => {
    this._scrollRef = ref;
  };

  render() {
    let {
      data,
      ListHeaderComponent,
      ListFooterComponent,
      onScroll,
      onEndReached,
      onEndReachedThreshold,
      onMomentumScrollBegin,
      onMomentumScrollEnd,
      onScrollBeginDrag,
      onScrollEndDrag,
      contentContainerStyle,
    } = this.props;

    if (data == null || data.length === 0) {
      ListFooterComponent = undefined;
    }
    return (
      <VirtualizedList
        onLayout={this._onLayout}
        ref={(ref) => this.createRef(ref)}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        showsVerticalScrollIndicator={false}
        data={[1]}
        renderItem={this.renderWaterFall}
        getItem={this._getItem}
        getItemCount={() => 1}
        extraData={this}
        onScroll={onScroll}
        scrollEventThrottle={16}
        initialScrollIndex={undefined}
        {...{
          onEndReached,
          onEndReachedThreshold,
          onMomentumScrollBegin,
          onMomentumScrollEnd,
          onScrollBeginDrag,
          contentContainerStyle,
          onScrollEndDrag,
        }}
        keyExtractor={() => '1'}
      />
    );
  }
}

export default WaterFallList;
