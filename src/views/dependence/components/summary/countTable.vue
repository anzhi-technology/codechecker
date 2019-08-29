<template>
  <div>
    <a-row :gutter="8">
      <a-col :span="24">
        <a-card >
          <a-table :columns="columns"
                   :dataSource="tableData"
                   :pagination="pagination"
                   :loading="loading"
                   :rowKey="record => record.fileName">

          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {getColumn} from "@/utils/myUtils";
import config from "@/utils/config";
export default {
  name: "countTable",
  props: {
    dataSource: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      pagination: config.pagination,
    }
  },
  computed: {
    columns() {
      const columns = [
        getColumn("Dependency", "fileName", (a, b) => a.name.localeCompare(b.name)),
        getColumn("CPE", "cpe", (a, b) => a.number - b.number),
        getColumn("gav", "gav", (a, b) => a.files - b.files),
      ];
      return columns;
    },
    tableData(){
      let dataSource = this.dataSource;
      let handleData = [];
      dataSource.forEach(obj =>{
        let cpeArray = [];
        let gavArray = [];
        obj.identifiers.forEach(obj_identifiers=>{
          let cpeValue = obj_identifiers.type === "cpe" ? obj_identifiers.value :"";
          let gavValue = obj_identifiers.type !== "cpe" ? obj_identifiers.value :"";
          cpeArray.push(cpeValue);
          gavArray.push(gavValue);
        });
        handleData.push({
          "fileName":obj.fileName,
          'cpe':cpeArray.join("\n\r"),
          "gav":gavArray.join("\n\r"),
          "highestSeverity":""
        });
      });
      return handleData
    }
  }
}
</script>

<style scoped>

</style>