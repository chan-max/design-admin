<script setup lang="tsx">
import { ContentWrap } from "@/components/ContentWrap";
import { useI18n } from "@/hooks/web/useI18n";
import { Table } from "@/components/Table";
import { ref, unref, nextTick, watch, reactive } from "vue";
import { ElTree, ElInput, ElDivider ,ElMessageBox} from "element-plus";
import {
  getDepartmentApi,
  getUserListApi,
  saveUserApi,
  deleteUserByIdApi,
} from "@/api/department";

import { getFileListApi } from "@/api/resource";

import type { DepartmentItem, DepartmentUserItem } from "@/api/department/types";
import { registerApi } from "@/api/user";
import { placeholderSign } from 'element-plus/es/components/table-v2/src/private'
import { useTable } from "@/hooks/web/useTable";
import { Search } from "@/components/Search";
import Detail from "./components/Detail.vue";
import { Dialog } from "@/components/Dialog";
import { getRoleListApi } from "@/api/role";
import { CrudSchema, useCrudSchemas } from "@/hooks/web/useCrudSchemas";
import { BaseButton } from "@/components/Button";
import { Form } from '@/components/Form'
const { t } = useI18n();

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState;
    const res = await getFileListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams),
    });
    return {
      list: res.data.list || [],
      total: res.data.total || 0,
    };
  },
  fetchDelApi: async () => {
    const res = await deleteUserByIdApi(unref(ids));
    return !!res;
  },
});

const { total, loading, dataList, pageSize, currentPage } = tableState;
const { getList, getElTableExpose, delList } = tableMethods;

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: "selection",
    search: {
      hidden: true,
    },
    form: {
      hidden: true,
    },
    detail: {
      hidden: true,
    },
    table: {
      type: "selection",
    },
  },
  {
    field: "index",
    label: t("userDemo.index"),
    form: {
      hidden: true,
    },
    search: {
      hidden: true,
    },
    detail: {
      hidden: true,
    },
    table: {
      type: "index",
    },
  },
  {
    field: "id",
    label: "id",
  },
  {
    field: "name",
    label: "文件名",
  },

  {
    field: "type",
    label: "文件类型",
  },
  {
    field: "size",
    label: "文件大小",
    form: {
      component: "Input",
    },
    search: {
      hidden: true,
    },
  },
  {
    field: "create_time",
    label: t("userDemo.create_time"),
    form: {
      component: "Input",
    },
    search: {
      hidden: true,
    },
  },
  {
    field: "action",
    label: t("userDemo.action"),
    form: {
      hidden: true,
    },
    detail: {
      hidden: true,
    },
    search: {
      hidden: true,
    },
    table: {
      width: 240,
      slots: {
        default: (data: any) => {
          const row = data.row as DepartmentUserItem;
          return (
            <>
              <BaseButton type="primary" onClick={() => action(row, "edit")}>
                {t("exampleDemo.edit")}
              </BaseButton>
              <BaseButton type="success" onClick={() => action(row, "detail")}>
                {t("exampleDemo.detail")}
              </BaseButton>
              <BaseButton type="danger" onClick={() => delData(row)}>
                {t("exampleDemo.del")}
              </BaseButton>
            </>
          );
        },
      },
    },
  },
]);

const { allSchemas } = useCrudSchemas(crudSchemas);

const searchParams = ref({});
const setSearchParams = (params: any) => {
  currentPage.value = 1;
  searchParams.value = params;
  getList();
};

const currentChange = (data: DepartmentItem) => {
  // if (data.children) return
  currentNodeKey.value = data.id;
  currentPage.value = 1;
  getList();
};

const filterNode = (value: string, data: DepartmentItem) => {
  if (!value) return true;
  return data.departmentName.includes(value);
};

const dialogVisible = ref(false);
const dialogTitle = ref("");

const currentRow = ref<DepartmentUserItem>();
const actionType = ref("");

const AddAction = () => {
  dialogTitle.value = t("exampleDemo.add");
  currentRow.value = undefined;
  dialogVisible.value = true;
  actionType.value = "";
};

const delLoading = ref(false);
const ids = ref<string[]>([]);

const delData = async (row?: DepartmentUserItem) => {
  const elTableExpose = await getElTableExpose();
  ids.value = row
    ? [row.id]
    : elTableExpose?.getSelectionRows().map((v: DepartmentUserItem) => v.id) || [];
  delLoading.value = true;

  await delList(unref(ids).length).finally(() => {
    delLoading.value = false;
  });
};

const action = (row: DepartmentUserItem, type: string) => {
  dialogTitle.value = t(type === "edit" ? "exampleDemo.edit" : "exampleDemo.detail");
  actionType.value = type;
  currentRow.value = { ...row, department: unref(treeEl)?.getCurrentNode() || {} };
  dialogVisible.value = true;
};

const formRef = ref();

const saveLoading = ref(false);

const schema = reactive([
  {
    field: 'name',
    label: '商品名称',
    component: 'Input',
    componentProps: {
    },
    colProps:{
        span:24
    }
  },
  {
    field: 'name',
    label: '商品名称',
    component: 'Input',
    componentProps: {
    },
    formItemProps:{
        slots:{
            default:() => <h1> 12321313 </h1>
        }
    },
    colProps:{
        span:24
    }
  },
  {
    field: 'field83',
    component: 'Upload',
    label: '商品模型文件',
    componentProps: {
      limit: 1,
      action: 'https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15',
      fileList: [
      ],
      multiple: false,
      onPreview: (uploadFile) => {
        console.log(uploadFile)
      },
      onRemove: (file) => {
        debuggers
        console.log(file)
      },
      beforeRemove: (uploadFile) => {
        debugger
        return ElMessageBox.confirm(`Cancel the transfer of ${uploadFile.name} ?`).then(
          () => true,
          () => false
        )
      },
      onExceed: (files, uploadFiles) => {
        ElMessage.warning(
          `The limit is 3, you selected ${files.length} files this time, add up to ${
            files.length + uploadFiles.length
          } totally`
        )
      },
      slots: {
        default: () => <BaseButton type="primary">Click to upload</BaseButton>,
        tip: () => <div class="el-upload__tip">jpg/png files with a size less than 500KB.</div>
      }
    },
    colProps:{
        span:24
    }
  },
]);


const save = async () => {
  const form = unref(formRef);
  const formData = await form?.submit();
  debugger
  if (formData) {
    saveLoading.value = true;
    try {
      const res = await registerApi(formData);
      if (res) {
        currentPage.value = 1;
        getList();
      }
    } catch (error) {
      console.log(error);
    } finally {
      saveLoading.value = false;
      dialogVisible.value = false;
    }
  }
};
</script>

<template>
  <div class="flex w-100% h-100%">
    <ContentWrap class="flex-[3]">
      <Search
        :schema="allSchemas.searchSchema"
        @reset="setSearchParams"
        @search="setSearchParams"
      />

      <div class="mb-10px">
        <BaseButton type="primary" @click="AddAction">{{
          t("exampleDemo.add")
        }}</BaseButton>
        <BaseButton :loading="delLoading" type="danger" @click="delData()">
          {{ t("exampleDemo.del") }}
        </BaseButton>
      </div>
      <Table
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :columns="allSchemas.tableColumns"
        :data="dataList"
        :loading="loading"
        @register="tableRegister"
        :pagination="{
          total,
        }"
      />
    </ContentWrap>

    <Dialog v-model="dialogVisible" :title="dialogTitle">
      <Form :schema="schema" label-width="auto" :label-position="'right'" />

      <template #footer>
        <BaseButton
          v-if="actionType !== 'detail'"
          type="primary"
          :loading="saveLoading"
          @click="save"
        >
          {{ t("exampleDemo.save") }}
        </BaseButton>
        <BaseButton @click="dialogVisible = false">{{
          t("dialogDemo.close")
        }}</BaseButton>
      </template>
    </Dialog>
  </div>
</template>
