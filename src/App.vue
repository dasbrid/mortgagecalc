<template>
  <div id="app">
    <div>
      <img alt="Mortgage Calc" title="v1.7" src="./assets/logo.png" width="64" >
      <div v-if="updateExists">   
      <!-- Colored icon button -->
      <button  @click="refreshApp()" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored">
        <i class="material-icons">refresh</i>
      </button> New version available! Click to update
      </div>
      <div v-if="installPossible">   
      <!-- Colored icon button -->
      <button  @click="installer()" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored">
        <i class="material-icons">add_circle</i>
      </button> Install this app
      </div>
    </div>
    <HelloWorld/>
  </div>
</template>

<script>
// see https://medium.com/@dougallrich/give-users-control-over-app-updates-in-vue-cli-3-pwas-20453aedc1f2
// for how to detect and install updates

require('material-design-lite')
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  },
  data() {
  return {
    // for installing locally
    installPossible: false,
    installer: null,
    // for detecting update and refreshing
    refreshing: false,
    updateExists: false
    }
  },
  methods: {
    // for detecting updates and refreshing
    showRefreshUI (e) {
      console.log("showrefreshUI");
      this.registration = e.detail;
      this.updateExists = true;
    },
    refreshApp () {
      console.log("refreshApp");
      this.updateExists = false;
      if (!this.registration || !this.registration.waiting) { return; }
      this.registration.waiting.postMessage('skipWaiting');
},
  },
  created() {
    // for installing locally
    let installPrompt;
    window.addEventListener("beforeinstallprompt", e=> {
      console.log("beforeinstallprompt")
      e.preventDefault();
      installPrompt = e;
      console.log(installPrompt);
      this.installPossible = true;
    });

    this.installer = () => {
      this.installPossible = false;
      installPrompt.prompt();
      installPrompt.userChoice.then(result => {
        if (result.outcome === "accepted") {
          console.log("User accepted");
        } else {
          console.log("user declined");
        }
        installPrompt = null;
      });
    };

    // for detecting updates and refreshing
    document.addEventListener(
    'swUpdated', this.showRefreshUI, { once: true }
    );
    navigator.serviceWorker.addEventListener(
    'controllerchange', () => {
      if (this.refreshing) return;
      this.refreshing = true;
      window.location.reload();
    }
  );
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
@import url('https://code.getmdl.io/1.2.1/material.blue-red.min.css');
* {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 5px;
}
</style>
