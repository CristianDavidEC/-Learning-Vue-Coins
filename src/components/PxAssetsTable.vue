<template>
  <div class="flex justify-center container px-5 sm:px-20 mt-4">
    <table>
      <thead>
        <tr class="bg-gray-100 border-b-2 border-gray-400">
          <th></th>
          <th
            :class="{ up: this.sortOrder === 1, down: this.sortOrder === -1 }"
          >
            <span class="underline cursor-pointer" @click="ChangeSortOrder"
              >Ranking
            </span>
          </th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Cap. de Mercado</th>
          <th>Variación 24hs</th>
          <td class="hidden sm:block">
            <input
              class="bg-gray-100 focus:outline-none border-b border-gray-400 py-2 px-4 block w-full appearance-none leading-normal"
              id="filter"
              placeholder="Buscar..."
              type="text"
              v-model="filter"
            />
          </td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="asset in filterAssets"
          :key="asset.id"
          class="border-b border-gray-200 hover:bg-gray-100 hover:bg-orange-100"
        >
          <td>
            <img
              class="w-12 h-12"
              :src="`https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`"
              :alt="asset.name"
            />
          </td>
          <td>
            <b>#{{ asset.rank }}</b>
          </td>
          <td>
            <router-link
              class="hover:underline text-green-600"
              :to="{ name: 'coin-detail', params: { id: asset.id } }"
            >
              {{ asset.name }}
            </router-link>
            <small class="ml-1 text-gray-500">
              {{ asset.symbol }}
            </small>
          </td>
          <td>{{ $filters.dollarFilter(asset.priceUsd) }}</td>
          <td>{{ $filters.dollarFilter(asset.marketCapUsd) }}</td>
          <td
            :class="
              asset.changePercent24Hr.includes('-')
                ? 'text-red-600'
                : 'text-green-600'
            "
          >
            {{ $filters.percentFilter(asset.changePercent24Hr) }}
          </td>
          <td class="hidden sm:block">
            <!--This click refers to click $emit-->
            <px-button @click-btn="goToCoin(asset.id)">
              <span>Detalles</span>
            </px-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import PxButton from "@/components/PxButton.vue";
export default {
  name: "PxAssetsTable",

  components: { PxButton },

  data() {
    return {
      filter: "",
      sortOrder: 1,
    };
  },

  computed: {
    filterAssets() {
      const altOrder = this.sortOrder === 1 ? -1 : 1;
      return this.assets
        .filter(
          (asset) =>
            asset.symbol.toLowerCase().includes(this.filter.toLowerCase()) ||
            asset.name.toLowerCase().includes(this.filter.toLowerCase())
        )
        .sort((a, b) => {
          if (parseInt(a.rank) > parseInt(b.rank)) {
            return this.sortOrder;
          } else {
            return altOrder;
          }
        });
    },
  },

  props: {
    assets: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    goToCoin(coin) {
      //$router can navigateinto routes
      //Push navigate to a new route
      this.$router.push({ name: "coin-detail", params: { id: coin } });
    },

    ChangeSortOrder() {
      this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    },
  },
};
</script>

<style scoped>
/*Scope, aplicado solo al componente*/
.up::before {
  content: "👆";
}

.down::before {
  content: "👇";
}

td {
  padding: 20px 0px;
  font-size: 0.6rem;
  text-align: center;
  font-weight: bold;
}

th {
  padding: 5px;
  font-size: 0.6rem;
}

@media (min-width: 640px) {
  td,
  th {
    padding: 20px;
    font-size: 1rem;
  }

  th {
    padding: 12px;
  }
}
</style>
