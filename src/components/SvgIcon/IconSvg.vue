<template>
<!-- class绑定类名 -->
<svg :class="svgClass" aria-hidden="true">
    <!-- use绑定id -->
    <use :xlink:href="iconName" />
</svg>
</template>

<script>
    export default {
        name: 'svg-icon',
        props: {
            // 这个对应图标文件名，比如iconClass="svg文件名称" // 后面会说
            iconClass: {
                type: String,
                required: true
            },
            //图标类名，通过这个属性自定义类名，方便修改图标大小，颜色
            className: {
                type: String
            }
        },
        computed: {
            iconName() {
                return `#icon-${this.iconClass}`
            },
            svgClass() {
                if (this.className) {
                    return 'svg-icon ' + this.className
                } else {
                    return 'svg-icon'
                }
            }
        }
    }
</script>
<style  scoped>
    .svg-icon {
        /* 默认样式设置 默认宽高1em*/
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        /* 当前颜色 */
        fill: currentColor;
        overflow: hidden;
    }
</style>
