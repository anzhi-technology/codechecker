<template>
  <div>
    <a-row :gutter="8">
      <a-col :span="24">
        <a-card title="扫描源信息">
          <a-row>
            <template v-for="(value,key,index) in dataSource">
              <a-col :span="6" :key="index" style="font-size: 13px">
                <span>{{key}}:{{value|formatDate}}</span>
              </a-col>
            </template>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {timeToDateString} from "@/utils/myUtils";

export default {
  name: "scanDataSource",
  props:{
    dataSource:{
      type:Object,
      required:true,
    }
  },
  filters: {
    formatDate(value) {
      return timeToDateString(value*1)
    }
  }
}
</script>

<style scoped>

</style>