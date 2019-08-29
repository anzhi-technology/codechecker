<template>
  <div>
    <a-row :gutter="8">
      <a-col :span="6">
        <a-card :bodyStyle="CardOne">
          <span style="font-size: 25px">引擎版本:{{basicContent.version}}</span>
          <p>dependency-check version</p>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bodyStyle="CardTwo">
          <span style="font-size: 25px">扫描依赖数量:{{basicContent.dependenceNumber}}</span>
          <p>Dependencies Scanned</p>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bodyStyle="CardTree">
          <span style="font-size: 25px">缺陷依赖数量:{{basicContent.vulnerabilitiesDependence}}</span>
          <p>Vulnerable Dependencies</p>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card :bodyStyle="CardFour">
          <span style="font-size: 25px">缺陷总数:{{basicContent.vulnerabilitiesNumber}}</span>
          <p>Vulnerabilities Found</p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "headerCard",
  props:{
    basicContent:{
      type:Object,
      required:true
    }
  },
  data(){
    const color = {textAlign:"center", color:"#fff"};
    return {
      CardOne:{
        ...color,
        backgroundColor:"#3E83C1"
      },
      CardTwo:{
        ...color,
        backgroundColor:"#53B095"
      },
      CardTree:{
        ...color,
        backgroundColor:"#EDAE67"
      },
      CardFour:{
        ...color,
        backgroundColor:"#DC6068"
      },
    }
  }
}
</script>

<style scoped>

</style>