<template>
  <div>
    <template v-if="!$isEmpty(authUser)">
      <Sidebar />
      <div class="wrapper d-flex flex-column min-vh-100 bg-light">
        <HeaderNav />
        <div class="body flex-grow-1">
          <CContainer fluid class="min-vh-100">
            <CRow class="h-100">
              <CProgress :height="5" class="mb-3 px-0" v-show="progress_bar != 0">
                <CProgressBar :value="progress_bar"></CProgressBar>
              </CProgress>              
              <router-view />
            </CRow>
          </CContainer>
        </div>
      </div>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>  
</template>
<script>
  import { isEmpty } from 'lodash';
  import HeaderNav from '@/components/HeaderNav.vue';
  import Sidebar from '@/components/Sidebar.vue';
  export default {
    components:{
      HeaderNav,
      Sidebar
    },
    computed:{
      authUser(){
        return this.$store.getters.authUser;
      }
    },
    created(){
      this.$isEmpty = isEmpty;
    },
    data() {
      return {
        progress_bar: 0
      }
    },
    methods:{
      checkAuth(){
        this.$api
            .get(
              `/auth/user`,
              {},
              {
                onUploadProgress : (progressEvent) => {
                  console.log(progressEvent.loaded);
                  // const progress = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                  // Update state here
                  // onUploadProgress(progress);
                },              
              }
            )
            .then( ({ data: { user } }) => {

            })
            .catch( ({ response: { status } }) => {
              if(status == 401){
                this.$store.commit("auth",{});
                this.$router.push({name:"Login"});
              }
            })
            .finally( () => {

            });
      }
    },
    watch:{
      "$route":{
        handler(route){
          this.checkAuth();
        },
        deep:      true,
        immediate: true
      }
    }
  }
</script>