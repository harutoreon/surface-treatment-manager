<script setup>
defineProps({
  id: String,
  alt: String,
  icon: String,
  cardTitle: String,
  cardText: String,
  toAttribute: String,
  linkText: String
})
</script>

<template>
  <div class="card pt-2" v-bind:id="id" style="width: 19rem;">
    <img
      v-bind:alt="alt"
      class="card-img-top w-25"
      width="50"
      height="50"
      v-bind:src="icon"
    >
    <div class="card-body">
      <h5 class="card-title">
        {{ cardTitle }}
      </h5>
      <p class="card-text">
        {{ cardText }}
      </p>
      <RouterLink v-bind:to="toAttribute" class="card-link">
        {{ linkText }}
      </RouterLink>
    </div>
  </div>
</template>
