<template>
  <div  class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
  <header class="mdl-layout__header">
    <div class="mdl-layout-icon">
        <img alt="Mortgage Calc" title="v1.8" src="./assets/logo.png" height="32px" >
    </div>
    <div class="mdl-layout__header-row">
      <span class="mdl-layout__title">Mortgage Calc</span>
      <div class="mdl-layout-spacer"></div>
      <nav class="mdl-navigation">
        <a div v-if="installPossible" class="mdl-navigation__link" @click="installer()" href="#">Install</a>
        <a div v-if="updateExists" class="mdl-navigation__link" @click="refreshApp()" href="#">Update</a>
      </nav>
    </div>
  </header>
  <main class="mdl-layout__content">
  <HelloWorld/>
  </main>
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
.mdl-layout__header{
    overflow: visible;
}
</style>
