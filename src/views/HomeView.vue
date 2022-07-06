<template>
  <div class="flex justify-center mt-5">
    <pulser :loading="isLoading" :color="'#67C9B8'" />
    <px-assets-table v-if="!isLoading" :assets="assets" />
  </div>
</template>

<script>
import PxAssetsTable from "@/components/PxAssetsTable.vue";
import Pulser from "vue-spinner/src/PulseLoader.vue";

import api from "@/api";
export default {
  name: "HomePage",
  components: { PxAssetsTable, Pulser },

  data() {
    return {
      assets: [],
      isLoading: false,
    };
  },

  // functions than execute when the component is mounted
  created() {
    //Change state isLoading
    this.isLoading = true;
    api
      .getAssets()
      .then((assets) => {
        this.assets = assets;
      })
      .finally(() => {
        this.isLoading = false;
      });
  },
};
</script>
