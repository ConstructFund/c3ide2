<script setup>
import { ref } from "vue";

// toolbar items with save, undo, redo, and export buttons
const toolbarItems = ref([
  {
    label: "Save",
    icon: "pi pi-save",
    command: () => {
      console.log("Save");
    },
  },
  {
    label: "Undo",
    icon: "pi pi-undo",
    command: () => {
      console.log("Undo");
    },
  },
  {
    label: "Redo",
    icon: "pi pi-refresh",
    command: () => {
      console.log("Redo");
    },
  },
  {
    label: "Export",
    icon: "pi pi-external-link",
    command: () => {
      console.log("Export");
    },
  },
]);

// copy toolbar items but in the menubar format
const menuBarItems = ref([
  {
    separator: true,
  },
  {
    label: "Save",
    icon: "pi pi-save",
    command: () => {
      console.log("Save");
    },
  },
  {
    label: "Undo",
    icon: "pi pi-undo",
    command: () => {
      console.log("Undo");
    },
  },
  {
    label: "Redo",
    icon: "pi pi-refresh",
    command: () => {
      console.log("Redo");
    },
  },
  {
    label: "Export",
    icon: "pi pi-external-link",
    command: () => {
      console.log("Export");
    },
  },
]);

const sidebarItems = ref([
  {
    label: "Home",
    icon: "pi pi-home",
    to: "/",
  },
  {
    label: "About",
    icon: "pi pi-info-circle",
    to: "/about",
  },
]);
</script>

<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <Toolbar
      style="
        padding-top: 0;
        padding-bottom: 0;
        z-index: 99999;
        position: relative;
      "
    >
      <template #start>
        <!-- A title with the text "C3IDE2" followed by a few button with icons using the toolbar object -->
        <h3 class="p-m-0">C3IDE2</h3>
        <div style="width: 20px"></div>
        <Button
          v-for="item in toolbarItems"
          :key="item.label"
          :icon="item.icon"
          class="p-button-text p-button-plain p-ml-2"
          @click="item.command"
          v-tooltip.bottom="item.label"
        />
      </template>

      <template #end> </template>
    </Toolbar>

    <!-- <Menubar :model="menuBarItems" style="padding-top: 0; padding-bottom: 0">
      <template #start>
        <h3 class="p-m-0">C3IDE2</h3>
        <div style="width: 20px"></div>
      </template>
      <template #item="{ item }">
        <Divider v-if="item.separator" layout="vertical" />
        <Button
          v-else
          :key="item.label"
          :icon="item.icon"
          class="p-button-text p-button-plain p-ml-2"
          @click="item.command"
          v-tooltip.bottom="item.label"
        />
      </template>
    </Menubar> -->

    <div class="grid" style="flex-grow: 1">
      <div style="height: 100%">
        <!-- Menu that extends all the way to the bottom -->
        <Menu :model="sidebarItems" style="height: 100%" />
      </div>
      <div style="flex-grow: 1">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<style></style>
