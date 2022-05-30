<script type="text/javascript">
import axios from "axios";
const userinfo = {
  username: "",
  is_root: false,
  team_id: -1,
};
function getInfo() {
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: "/api/v1/info",
    })
      .then((response) => {
        if (response.data.code === 0) {
          console.log("身份已验证");
          userinfo.username = response.data.data.username;
          userinfo.is_root = response.data.data.is_root;
          userinfo.team_id =
            response.data.data.team_id === null
              ? -1
              : response.data.data.team_id;
          resolve();
        } else {
          console.log("未登录");
          reject();
        }
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}
export default {
  userinfo,
  getInfo,
};
</script>
