<template>
  <div>
    <a-card title="缺陷详情">
      <a-collapse accordion v-if="flag">
        <template v-for="(item,index) in detailData">
          <a-collapse-panel  :header="item.fileName" :key="index" :showArrow="false">
            <h4 v-if="item.filePath">File Path : {{item.filePath}}</h4>
            <h4 v-if="item.license">License : {{item.license}}</h4>
            <h4 v-if="item.description">Description : {{item.description}}</h4>
            <a-collapse>
              <!--Evidence-->
              <a-collapse-panel v-if="item.vendors.length !== 0" header="Evidence：" key="sub1" :showArrow="false">
                <a-table :columns="columns"
                         size="small"
                         :dataSource="item.vendors"
                         :pagination="false"
                         :rowKey="record => record.source + record.name + record.value">
                </a-table>
              </a-collapse-panel>
              <!--Identifiers-->
              <a-collapse-panel v-if="item.identifiers.length !== 0"  header="Identifiers：" key="sub2" :showArrow="false">
                <template v-for="(item_identifiers,index_identifiers) in item.identifiers">
                  <p :key="index_identifiers">
                    <strong>{{item_identifiers.type}} : </strong>
                    <a>{{item_identifiers.value}}</a>&nbsp;&nbsp;
                    <strong>Confidence</strong>: {{item_identifiers.confidence}}
                  </p>
                </template>
              </a-collapse-panel>
              <a-collapse-panel v-if="item.vulnerabilities.length !==0" header="Published Vulnerabilities：" key="sub3" :showArrow="false">
                <template v-for="(obj_vulnerabilities,index_vulnerabilities) in item.vulnerabilities">
                  <div :key="index_vulnerabilities">
                    <p>
                      <strong>{{obj_vulnerabilities.vulnerability.name}}</strong>
                    </p>
                    <p>
                      Severity : {{obj_vulnerabilities.severity}}<br>
                      CVSS Score : {{obj_vulnerabilities.vulnerability.cvssScore}}<br>
                      CWE : {{obj_vulnerabilities.vulnerability.cwe}}
                    </p>
                    <p>{{obj_vulnerabilities.vulnerability.description}}</p>
                    <ul>
                      <template v-for="(obj_references,index_references) in obj_vulnerabilities.vulnerability.references">
                        <div :key="index_references">
                          <li>{{obj_references.source}} -<a> {{obj_references.url}}</a></li>
                        </div>
                      </template>
                    </ul>
                    <strong>Vulnerable Software & Versions:</strong>
                    <ul>
                      <template v-for="(obj_vulnerableSoftware,index_vulnerableSoftware) in obj_vulnerabilities.vulnerability.vulnerableSoftware">
                        <div :key="index_vulnerableSoftware">
                          <li>{{obj_vulnerableSoftware.name}}</li>
                        </div>
                      </template>
                    </ul>
                  </div>
                </template>
              </a-collapse-panel>
            </a-collapse>
          </a-collapse-panel>
        </template>
      </a-collapse>
    </a-card>
  </div>
</template>

<script>
import {getColumn} from "@/utils/myUtils";
export default {
  name: "detailCollapse",
  props:{
    detailData:{
      type:Array,
      required:true
    },
    flag:{
      type:Boolean,
      required:true
    }
  },
  computed:{
    columns() {
      const columns = [
        getColumn("Source", "source"),
        getColumn("Name", "name"),
        getColumn("Value", "value"),
      ];
      return columns;
    },
  }
}
</script>

<style scoped>

</style>