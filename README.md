# taro-styles
为taro小程序框架提供类似rn的styles机制。
可以使用rn里是style语法。

使用示例：
```
const styles = createStyles({
  wrap: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
})

<View style={styles.wrap}></View>
```
