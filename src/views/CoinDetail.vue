<template>
  <div class="flex-col justify-center">
    <div class="flex justify-center mt-5">
      <bounce-loader :loading="isLoading" />
    </div>
    <template v-if="!isLoading">
      <div class="flex flex-col sm:flex-row justify-around items-center">
        <div class="flex flex-col items-center">
          <img
            :src="`https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`"
            :alt="asset.name"
            class="w-20 h-20 mr-5"
          />
          <h1 class="text-5xl">
            {{ asset.name }}
            <small class="sm:mr-2 text-gray-500">{{ asset.symbol }}</small>
          </h1>
        </div>

        <div class="my-10 flex flex-col">
          <ul>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Ranking</b>
              <span>#{{ asset.rank }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
              <span>{{ $filters.dollarFilter(asset.priceUsd) }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
              <span>{{ $filters.dollarFilter(min) }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
              <span>{{ $filters.dollarFilter(max) }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
              <span>{{ $filters.dollarFilter(avg) }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
              <span>{{ $filters.percentFilter(asset.changePercent24Hr) }}</span>
            </li>
          </ul>
        </div>

        <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
          <button
            @click="toggleConverter"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {{ fromUsd ? `USD a ${asset.symbol}` : `${asset.symbol} a USD` }}
          </button>

          <div class="flex flex-row my-5">
            <label class="w-full" for="convertValue">
              <input
                v-model="convertValue"
                id="convertValue"
                type="number"
                class="text-center bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                :placeholder="`Valor en ${fromUsd ? 'USD' : asset.symbol}`"
              />
            </label>
          </div>

          <span class="text-xl">{{ convertResult }}</span>
        </div>
      </div>
      <line-chart
        class="max-w-6xl mx-auto"
        :labels="chartLabels"
        :colors="['orange']"
        :min="min"
        :max="max"
        :data="history.map((h) => [h.date, parseFloat(h.priceUsd).toFixed(2)])"
      />

      <h3 class="text-xl my-10">Mejores Ofertas de Cambio</h3>
      <div class="container max-w-6xl mx-auto">
        <table class="w-full container">
          <tr
            v-for="m in markets"
            :key="`${m.exchangeId} - ${m.priceUsd}`"
            class="border-b"
          >
            <td>
              <b>{{ m.exchangeId }}</b>
            </td>
            <td>{{ $filters.dollarFilter(m.priceUsd) }}</td>
            <td>{{ m.baseSymbol }} / {{ m.quoteSymbol }}</td>
            <td>
              <px-button v-if="!m.url" @click-btn="getWebSite(m)">
                <slot>Obtener Link</slot>
              </px-button>
              <a
                v-else
                class="hover:underline text-green-600"
                target="_blanck"
                >{{ m.url }}</a
              >
            </td>
          </tr>
        </table>
      </div>
    </template>
  </div>
</template>

<script>
import api from "@/api";
import PxButton from "@/components/PxButton.vue";
import BounceLoader from "vue-spinner/src/BounceLoader.vue";

export default {
  name: "CoinDetail",
  components: { BounceLoader, PxButton },
  data() {
    return {
      asset: {},
      history: [],
      isLoading: false,
      markets: [],
      fromUsd: true,
      convertValue: null,
    };
  },

  computed: {
    convertResult() {
      if (!this.convertValue) {
        return 0;
      }
      const result = this.fromUsd
        ? this.convertValue / this.asset.priceUsd
        : this.convertValue * this.asset.priceUsd;

      return result.toFixed(4);
    },

    min() {
      return Math.min(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      );
    },

    max() {
      return Math.max(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      );
    },

    avg() {
      return (
        this.history.reduce((a, b) => a + parseFloat(b.priceUsd), 0) /
        this.history.length
      );
    },
  },

  // Hear change the one elemento, properti o part of componente
  watch: {
    $route() {
      this.getCoin();
    },
  },

  created() {
    this.getCoin();
  },

  methods: {
    getCoin() {
      // Get the coin from the API Router $route is the router object information
      const id = this.$route.params.id;
      this.isLoading = true;
      Promise.all([
        api.getAsset(id),
        api.getAssetHistory(id),
        api.getMarkets(id),
      ])
        .then(([asset, history, markets]) => {
          this.asset = asset;
          this.history = history;
          this.markets = markets;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getWebSite(exchange) {
      return api.getExchange(exchange.exchangeId).then((res) => {
        exchange.url = res.exchangeUrl;
      });
    },

    toggleConverter() {
      this.fromUsd = !this.fromUsd;
    },
  },
};
</script>

<style scoped>
td {
  padding: 10px;
  text-align: center;
}

span {
  font-weight: bold;
}
</style>
