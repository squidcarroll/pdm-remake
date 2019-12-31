/* eslint-disable */
<template>
  <div class="content">
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-20">
        <Login></Login>
      </div>
      <div class="md-layout-item">
        <ShowData></ShowData>
      </div>
    </div>
  </div>
</template>

<script>
import ShowData from "./componentModules/showData";
import Login from "./componentModules/login";

export default {
  name: "mainPage",
  components: {
    ShowData,
    Login
  },
  data() {
    return {};
  },
  methods: {
    logIt: function() {
      this.$logger.log("info", "Hello created log files!");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
  color: white;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.content {
  padding: 20px;
}
</style>
