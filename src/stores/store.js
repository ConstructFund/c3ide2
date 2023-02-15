import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { appDataDir } from "@tauri-apps/api/path";
import { readTextFile } from "@tauri-apps/api/fs";

export const useProjectStore = defineStore("project", () => {
  const projectData = ref({});

  return {};
});

export const useGlobalStore = defineStore("projectList", () => {
  const projects = ref([]);
  const isLoadingProjects = ref(false);
  const hasAnyChanges = ref(false);
  const hasProjectLoaded = ref(false);
  const addProject = (project) => {
    projects.value.push(project);
    saveProjectListToStorage();
  };
  return { projects, addProject, isLoadingProjects, hasAnyChanges };
});

export const useUndoRedoStore = defineStore("undoRedo", () => {
  const undoStack = ref([]);
  const hasUndo = computed(() => undoStack.value.length > 0);
  const redoStack = ref([]);
  const hasRedo = computed(() => redoStack.value.length > 0);
  const undo = (callback) => {
    if (undoStack.value.length > 0) {
      const action = undoStack.value.pop();
      callback(action);
      redoStack.value.push(action);
    }
  };
  const redo = (callback) => {
    if (redoStack.value.length > 0) {
      const action = redoStack.value.pop();
      callback(action);
      undoStack.value.push(action);
    }
  };
  const addAction = (action) => {
    undoStack.value.push(action);
  };
  return { undo, redo, addAction, hasUndo, hasRedo };
});

export async function loadProjectListFromStorage() {
  const globalStore = useGlobalStore();
  globalStore.isLoadingProjects = true;

  // load database from appdata folder
  const appDataDirPath = await appDataDir();
  const projectListPath = `${appDataDirPath}/projectsList.json`;
  const projectListFile = await readTextFile({
    dir: projectListPath,
  });
  const projectListJson = JSON.parse(projectListFile);
  if (projectListJson && projectListJson.isC3IDEProjectList) {
    globalStore.projects = projectListJson.projects;
  } else {
    console.error("Invalid project list file");
  }
  globalStore.isLoadingProjects = true;
}

export async function saveProjectListToStorage() {
  const projectList = useGlobalStore();
  const appDataDirPath = await appDataDir();
  const projectListPath = `${appDataDirPath}/projectsList.json`;
  const projectListJson = {
    isC3IDEProjectList: true,
    projects: projectList.projects,
  };
  await writeTextFile({
    dir: projectListPath,
    contents: JSON.stringify(projectListJson),
  });
}
