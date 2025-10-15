<script setup>
const props = defineProps({
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
  <div class="card pt-2" v-bind:id="props.id" style="width: 19rem;">
    <img
      v-bind:alt="props.alt"
      class="card-img-top w-25"
      width="50"
      height="50"
      v-bind:src="props.icon"
    >
    <div class="card-body">
      <h5 class="card-title">
        {{ props.cardTitle }}
      </h5>
      <p class="card-text">
        {{ props.cardText }}
      </p>
      <RouterLink v-bind:to="props.toAttribute" class="card-link">
        {{ props.linkText }}
      </RouterLink>
    </div>
  </div>
</template>
