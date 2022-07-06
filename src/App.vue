<template>
  <main>
    <px-header :links="links" />
    <router-view />
  </main>
</template>

<script>
import PxHeader from "@/components/PxHeader.vue";

export default {
  name: "App",
  components: { PxHeader },

  data() {
    return {
      links: [
        {
          title: "BTC",
          to: { name: "coin-detail", params: { id: "bitcoin" } },
        },
        {
          title: "ETH",
          to: { name: "coin-detail", params: { id: "ethereum" } },
        },
        {
          title: "XRP",
          to: { name: "coin-detail", params: { id: "xrp" } },
        },
      ],
    };
  },
};
</script>

<style></style>
