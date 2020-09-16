<template>
    <a-table :columns="outerColumns" :data-source="dataSource"  :rowKey="rowKey"   class="subtable">
        <a slot="operation"  >Publish</a>
        <template slot-scope="text, record, index" :slot="slot" v-for="slot in scopedSlots">
            <slot :name="slot" v-bind="{text, record, index}"></slot>
        </template>
        <template :slot="slot" v-for="slot in slots">
            <slot :name="slot"></slot>
        </template>
    </a-table>
</template>

<script>
    export default {
        name: "SubTable",
        props: {
            bordered: Boolean,
            loading: [Boolean, Object],
            outerColumns: Array,
            innerColumns: Array,
            innerData:Array,
            dataSource: Array,
            pagination: {
                type: [Object, Boolean],
                default: true
            },
            rowKey: {
                type: [String, Function],
                default: 'key'
            },
            selectedRows: Array
        },
        data() {
            return {
                scopedSlots: [],
                slots: []
            }
        },
        methods: {
            updateSelect (selectedRowKeys, selectedRows) {
                this.$emit('update:selectedRows', selectedRows)
                this.$emit('selectedRowChange', selectedRowKeys, selectedRows)
            },
            initTotalList (columns) {
                const totalList = columns.filter(item => item.needTotal)
                    .map(item => {
                        return {
                            ...item,
                            total: 0
                        }
                    })
                return totalList
            },
            getScopedSlots(columns) {
                let scopedSlots = columns.filter(item => item.scopedSlots).map(item => item.scopedSlots)
                scopedSlots = scopedSlots.flatMap(item => Object.values(item))
                return scopedSlots
            },
            getSlots(columns) {
                let slots = columns.filter(item => item.slots).map(item => item.slots)
                slots = slots.flatMap(item => Object.values(item))
                return slots
            },
            onClear() {
                this.updateSelect([], [])
                this.$emit('clear')
            },
            onChange(pagination, filters, sorter, {currentDataSource}) {
                this.$emit('change', pagination, filters, sorter, {currentDataSource})
            }
        },
    }
</script>

<style lang="less" scoped>
.subtable {
    background-color: @base-bg-color;
}
</style>