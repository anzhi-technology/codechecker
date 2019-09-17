<template>
  <div>
    <a-row :gutter="8">
      <a-col :span="24">
        <a-card title="缺陷列表">
          <a-table :columns="columns"
                   :dataSource="tableData"
                   :pagination="pagination"
                   :loading="loading"
                   :scroll="{ x: 1300 }"
                   :rowKey="record => record.fileName">

            <span slot="cpe" slot-scope="text, record">
              <template v-for="(item,index) in record.cpe">
                <p :key="index">{{item}}</p>
              </template>
            </span>
            <span slot="gav" slot-scope="text, record">
              <template v-for="(item,index) in record.gav">
                <p :key="index">{{item}}</p>
              </template>
            </span>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {getColumn,getFixedColumn} from "@/utils/myUtils";
import config from "@/utils/config";
export default {
  name: "countTable",
  props: {
    dataSource: {
      type: Array,
      required: true
    },
    loading: {
      type:Boolean,
      required: true
    }
  },
  data() {
    return {
      pagination: config.pagination,
    }
  },
  computed: {
    columns() {
      const columns = [
        getFixedColumn("Dependency", "fileName", "left",(a, b) => a.fileName.localeCompare(b.fileName)),
        getColumn("CPE", "cpe", (a, b) => a.cpe.localeCompare(b.cpe)),
        getColumn("GAV", "gav", (a, b) => a.gav.localeCompare(b.gav)),
        getColumn("Highest Severity", "highestSeverity", (a, b) => a.highestSeverity.localeCompare(b.highestSeverity)),
        getColumn("CVE Count", "cve", (a, b) => a.cve - b.cve),
        getColumn("CPE Confidence", "cpeConfidence", (a, b) => a.cpeConfidence.localeCompare(b.cpeConfidence)),
        getColumn("Evidence Count", "evidenceCount", (a, b) => a.evidenceCount - b.evidenceCount),
      ];
      return columns;
    },
    tableData(){
      let dataSource = this.dataSource;
      let handleData = [];
      dataSource.forEach(obj =>{
        let cpeArray = [];
        let gavArray = [];
        let confidence="";
        obj.identifiers.forEach(obj_identifiers=>{
          let cpeValue = obj_identifiers.type === "cpe" ? obj_identifiers.value :"";
          let gavValue = obj_identifiers.type !== "cpe" ? obj_identifiers.value :"";
          cpeArray.push(cpeValue);
          gavArray.push(gavValue);
          //取最高等级
          if(obj_identifiers.type === "cpe"){
            if(obj_identifiers.confidence === "HIGHEST"){
              confidence = "HIGHEST"
            }else{
              if(obj_identifiers.confidence === "HIGH"){
                confidence = "HIGH"
              }else{
                if(obj_identifiers.confidence === "MEDIUM"){
                  confidence = "MEDIUM"
                }else{
                  confidence = "LOW"
                }
              }
            }
          }
        });
        //取最高等级
        let severity = "";
        if(obj.hasOwnProperty("vulnerabilities")){
          obj.vulnerabilities.forEach(obj_vulnerabilities=>{
            if(obj_vulnerabilities.severity === "Highest"){
              severity = "Highest"
            }else{
              if(obj_vulnerabilities.severity === "High"){
                severity = "High"
              }else{
                if(obj_vulnerabilities.severity === "Medium"){
                  severity = "Medium"
                }else{
                  severity = "Low"
                }
              }
            }
          })
        }
        handleData.push({
          "fileName":obj.fileName,
          'cpe':cpeArray,
          "gav":gavArray,
          "highestSeverity":severity,
          "cve":obj.hasOwnProperty("vulnerabilities") ? obj.vulnerabilities.length : 0 ,
          "cpeConfidence":confidence,
          "evidenceCount":obj.vendors.length + obj.products.length + obj.versions.length
        });
      });
      return handleData
    }
  }
}
</script>

<style scoped>

</style>