<template functional>
  <a-sub-menu :key="props.menuInfo.path">
    <span slot="title">
      <!--<span v-if="props.menuInfo.meta.icon" :class="props.menuInfo.meta.icon"></span>-->
      <a-icon v-if="props.menuInfo.meta.icon" :type="props.menuInfo.meta.icon"/>
      <span>{{props.menuInfo.meta.title}}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item
        v-if="item.children.length === 0"
        :key="item.path"
        @click="() =>parent.$router.push({ path: item.path, query: parent.$route.query })">
        <!--<span v-if="item.meta.icon" :class="props.menuInfo.meta.icon"></span>-->
        <a-icon v-if="item.meta.icon" :type="item.meta.icon" />
        <span>{{item.meta.title}}</span>
      </a-menu-item>
      <sub-menu v-else :key="item.path" :menu-info="item" />
    </template>
  </a-sub-menu>
</template>
<script>
export default {
  props: ['menuInfo']
};
</script>
