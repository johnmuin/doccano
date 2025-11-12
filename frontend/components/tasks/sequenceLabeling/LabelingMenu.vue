<template>
  <v-menu
    :value="opened"
    :position-x="x"
    :position-y="y"
    absolute
    offset-y
    :close-on-content-click="false"
    persistent
  >
    <v-card min-width="250" max-width="350">
      <v-card-title class="text-subtitle-2 pa-3">
        选择实体类型
      </v-card-title>
      <v-card-text class="pa-0">
        <v-list dense max-height="300" class="overflow-y-auto">
          <v-list-item
            v-for="(label, i) in labels"
            :key="i"
            :class="{ 'v-list-item--active': selectedLabelId === label.id }"
            @click="selectLabel(label.id)"
          >
            <v-list-item-action v-if="hasAnySuffixKey">
              <v-chip
                v-if="label.suffixKey"
                :color="label.backgroundColor"
                outlined
                small
                v-text="label.suffixKey"
              />
              <span v-else class="mr-8" />
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="label.text" />
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider />

        <div class="pa-3">
          <v-text-field
            v-model="standardId"
            label="标准化ID (可选)"
            placeholder="如: D001, MeSH:C123..."
            dense
            :rules="[v => standardIdRules(v)]"
            clearable
            @keyup.enter="confirmSelection"
          />
        </div>
      </v-card-text>

      <v-card-actions class="pa-3 pt-0">
        <v-spacer />
        <v-btn text @click="close">取消</v-btn>
        <v-btn
          color="primary"
          :disabled="!selectedLabelId"
          @click="confirmSelection"
        >
          确认
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    labels: {
      type: Array,
      default: () => [],
      required: true
    },
    opened: {
      type: Boolean,
      default: false,
      required: true
    },
    selectedLabel: {
      type: Object,
      default: null,
      required: false
    },
    x: {
      type: Number,
      default: 0,
      required: true
    },
    y: {
      type: Number,
      default: 0,
      required: true
    },
    currentStandardId: {
      type: String,
      default: '',
      required: false
    }
  },

  data() {
    return {
      startOffset: 0,
      endOffset: 0,
      entity: null as any,
      fromEntity: null as any,
      toEntity: null as any,
      standardId: '',
      selectedLabelId: null as number | null,
      standardIdRules: (value: string) => {
        if (!value) return true // 可选字段，空值时通过验证
        // 基本格式验证：允许字母、数字、冒号、连字符
        const validPattern = /^[A-Za-z0-9:-]+$/
        if (!validPattern.test(value)) {
          return '标准化ID只能包含字母、数字、冒号和连字符'
        }
        if (value.length > 50) {
          return '标准化ID长度不能超过50个字符'
        }
        return true
      }
    }
  },

  computed: {
    hasAnySuffixKey(): boolean {
      return this.labels.some((label: any) => label.suffixKey !== null)
    }
  },

  watch: {
    // 监听selectedLabel变化，用于编辑现有实体时预选标签和标准化ID
    selectedLabel(newVal) {
      if (newVal && newVal.id) {
        this.selectedLabelId = newVal.id
        // 如果是编辑现有实体，预填充当前的标准化ID
        this.standardId = this.currentStandardId || ''
      } else {
        this.selectedLabelId = null
        this.standardId = ''
      }
    },

    // 监听opened状态，确保每次打开时正确初始化
    opened(newVal) {
      if (newVal) {
        // 如果是编辑模式且有选中的标签，预选它
        if (this.selectedLabel && this.selectedLabel.id) {
          this.selectedLabelId = this.selectedLabel.id
          this.standardId = this.currentStandardId || ''
        }
      } else {
        // 关闭时清理状态
        this.standardId = ''
        this.selectedLabelId = null
      }
    }
  },

  methods: {
    close() {
      this.standardId = ''
      this.selectedLabelId = null
      this.$emit('close')
    },

    selectLabel(labelId: number) {
      this.selectedLabelId = labelId
    },

    confirmSelection() {
      if (!this.selectedLabelId) {
        return
      }

      // 验证标准化ID格式
      if (this.standardId && !this.standardIdRules(this.standardId)) {
        return // 验证失败，不执行选择
      }

      this.$emit('click:label', this.selectedLabelId, this.standardId)
      this.close()
    },

    // 为兼容性保留的方法，按回车键时调用
    onEnter() {
      if (this.selectedLabelId) {
        this.confirmSelection()
      }
    }
  }
})
</script>