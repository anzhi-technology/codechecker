import { getConfigData } from "@/api/system/system";

export default {
  data() {
    let config = {
      "searchValue": null,
      "createBy": null,
      "createTime": null,
      "updateBy": null,
      "updateTime": null,
      "remark": null,
      "params": null,
      "configId": null,
      "configName": null,
      "configKey": null,
      "configValue": null,
      "configType": null
    };
    return {
      configValue:null
    };
  },
  methods: {
    async getConfig() {
      let param = new FormData();
      return new Promise((resolve, reject) => {
        getConfigData(param)
          .then(res => {
            const filterData = res.rows.filter(
              item => item.configKey === "sys.user.initPassword"
            );
            this.configValue = filterData[0].configValue;
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
  }
};
