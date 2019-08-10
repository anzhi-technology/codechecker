<template>
  <div>
      <a-icon  :type="isFullscreen?'fullscreen-exit':'fullscreen'" @click="click" />
  </div>
</template>

<script>
  import screenfull from 'screenfull'

  export default {
    name: 'fullScreen',
    data() {
      return {
        isFullscreen: false
      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.destroy()
    },
    methods: {
      click() {
        if (!screenfull.enabled) {
          this.$message.warning('您的浏览器不支持！');
          return false
        }
        //console.log();
        screenfull.toggle(document.getElementById(this.$parent.$attrs.id));
      },
      change() {
        this.isFullscreen = screenfull.isFullscreen
      },
      init() {
        if (screenfull.enabled) {
          screenfull.on('change', this.change)
        }
      },
      destroy() {
        if (screenfull.enabled) {
          screenfull.off('change', this.change)
        }
      }
    }
  }
</script>

<style scoped>
  .screenfull-svg {
    display: inline-block;
    cursor: pointer;
    fill: #5a5e66;;
    width: 20px;
    height: 20px;
    vertical-align: 10px;
  }
</style>
