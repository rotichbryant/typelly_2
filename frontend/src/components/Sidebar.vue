<template>
	<CSidebar
	  position="fixed"
	  :unfoldable="sidebarUnfoldable"
	  :visible="sidebarVisible"
	  @visible-change="
		(event) =>
		  $store.commit({
			type: 'updateSidebarVisible',
			value: event,
		  })
	  "
	>
	  <CSidebarBrand>
		<CIcon
		  custom-class-name="sidebar-brand-full"

		  :height="35"
		/>
		<CIcon
		  custom-class-name="sidebar-brand-narrow"

		  :height="35"
		/>
	  </CSidebarBrand>
	  <SidebarNav />
	  <CSidebarToggler
		class="d-none d-lg-flex"
		@click="$store.commit('toggleUnfoldable')"
	  />
	</CSidebar>
  </template>
  
 <script>
  import { mapGetters } from 'vuex';
  import { SidebarNav } from './SidebarNav'

  export default {
	name: 'Sidebar',
	components: {
		SidebarNav,
	},
	computed:{
		...mapGetters([
			"sidebarUnfoldable",
			"sidebarVisible"
		])
	}
  }
  </script>