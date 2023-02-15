<script setup>
import { ref } from "vue";
import { invoke } from "@tauri-apps/api/tauri";
</script>

<template>
  <div style="padding: 30px; height: 100%">
    <Splitter style="height: 100%">
      <SplitterPanel> Plugins </SplitterPanel>
      <SplitterPanel> Behaviors </SplitterPanel>
      <SplitterPanel> Effects </SplitterPanel>
    </Splitter>
  </div>
</template>
