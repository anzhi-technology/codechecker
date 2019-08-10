import { getDictData } from "@/api/system/system";

export default {
  data() {
    let dict = {
      "searchValue": null,
      "createBy": null,
      "createTime": null,
      "updateBy": null,
      "updateTime": null,
      "remark": null,
      "params": null,
      "dictCode": null,
      "dictSort": null,
      "dictLabel": null,
      "dictValue": null,
      "dictType": null,
      "cssClass": null,
      "listClass": null,
      "isDefault": null,
      "status": null
    };
    return {
      SexDicts: [dict],
      postStatusDicts:[dict],
      userStatusDicts:[dict],
      menuStatusDicts:[dict],
      deptStatusDicts:[dict],
      configStatusDicts:[dict],
      statusDicts:[dict],
      noticeDict:[dict],
      noticeStatusDict:[dict],
    };
  },
  methods: {
    async getDict() {
      let param = new FormData();
      return new Promise((resolve, reject) => {
        getDictData(param)
          .then(res => {
            this.SexDicts = res.rows.filter(
              item => item.dictType === "sys_user_sex"
            );
            this.statusDicts = res.rows.filter(
              item => item.dictType === "sys_normal_disable"
            );
            this.postStatusDicts = res.rows.filter(
              item => item.dictType === "sys_normal_disable"
            );
            this.userStatusDicts = res.rows.filter(
              item => item.dictType === "sys_normal_disable"
            );
            this.deptStatusDicts = res.rows.filter(
              item => item.dictType === "sys_normal_disable"
            );
            this.menuStatusDicts = res.rows.filter(
              item => item.dictType === "sys_show_hide"
            );
            this.configStatusDicts = res.rows.filter(
              item => item.dictType === "sys_yes_no"
            );
            this.noticeDict = res.rows.filter(
              item => item.dictType === "sys_notice_type"
            );
            this.noticeStatusDict = res.rows.filter(
              item => item.dictType === "sys_notice_status"
            );
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
  }
};
