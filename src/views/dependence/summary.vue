<template>
  <div>
    <a-row >
      <a-col :span="24">
        <headerCard :basicContent="basicContent"/>
        <br/>
      </a-col>
      <a-col :span="24">
        <scanDataSource :dataSource="dataSource"/>
        <br/>
      </a-col>
      <a-col :span="24">
        <countTable :dataSource="countData"/>
      </a-col>
      <a-col :span="6"></a-col>
    </a-row>
  </div>
</template>

<script>
import headerCard from  "@/views/dependence/components/summary/headerCard"
import scanDataSource from "@/views/dependence/components/summary/scanDataSource"
import countTable from "@/views/dependence/components/summary/countTable"
import {getDependenciesReport} from "@/api/dependence/dependence";
import _ from "underscore" //引入数据处理的分装方法

export default {
  name: "dependenceSummary",
  components:{
    headerCard,
    scanDataSource,
    countTable
  },
  data(){
    return {
      basicContent:{},//四个卡片统计的数据
      dataSource:{}, //扫描源信息
      countData:[],
    }
  },
  created(){
    this.$nextTick(()=>{
      this.getData();
    })
  },
  methods:{
    /*获取依赖检测的报告数据*/
    getData(){
      let projectId = this.$route.params.parameter;
      getDependenciesReport(projectId).then(res =>{
        let data = res.content;
        //四个card 统计内容
        let vulnerabilitiesDependence = data.dependencies.filter(obj => obj.vulnerabilities.length !== 0);
        let vulnerabilitiesNumberArray = [];
        vulnerabilitiesDependence.forEach(obj => {
          vulnerabilitiesNumberArray.push(obj.vulnerabilities.length);
        });
        let vulnerabilitiesNumber = _.reduce(vulnerabilitiesNumberArray, function(memo, num){ return memo + num; }, 0); //将数组的数字相加
        this.basicContent = {
          "version":data.dataSource.version,
          "dependenceNumber":data.dependencies.length,
          "vulnerabilitiesDependence":vulnerabilitiesDependence.length,
          "vulnerabilitiesNumber":vulnerabilitiesNumber
        };
        //扫描源信息
        this.dataSource = data.dataSource;
        delete this.dataSource.version; //删除version信息
        //统计的Table 信息
        this.countData =  data.dependencies;

      });
    }
  }
}
</script>

<style scoped>

</style>