const template = Footer => <View className='page-wrap'>
        <View className='header'>
            <Text text='hi'></Text>
        </View>
        <View v-for='(item, index) in items' key='index' className='container'>
            <Text on-click='onShowMessage' text='statusMsg'>
            </Text>
        </View>
        <View>
            <Child component={Footer} />
        </View>
    </View>;

export default template;