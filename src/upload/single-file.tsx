import { defineComponent, PropType } from 'vue';
import { CloseCircleFilledIcon, ErrorCircleFilledIcon, CheckCircleFilledIcon } from 'tdesign-icons-vue-next';
import TLoading from '../loading';

import { prefix } from '../config';
import { UploadFile } from './type';
import { ClassName } from '../common';
import { abridgeName, UPLOAD_NAME } from './util';
import props from './props';

export default defineComponent({
  name: 'TUploadSingleFile',

  components: {
    CloseCircleFilledIcon,
    TLoading,
    ErrorCircleFilledIcon,
    CheckCircleFilledIcon,
  },

  props: {
    showUploadProgress: props.showUploadProgress,
    file: Object as PropType<UploadFile>,
    loadingFile: Object as PropType<UploadFile>,
    remove: Function as PropType<(e: MouseEvent) => void>,
    placeholder: String,
    display: {
      type: String as PropType<'file' | 'file-input'>,
      validator(val: string) {
        return ['file', 'file-input'].includes(val);
      },
    },
  },

  computed: {
    percent(): number {
      return this.loadingFile && (this.loadingFile as UploadFile).percent;
    },
    showPreview(): boolean {
      return Boolean(this.file && (this.file as UploadFile).name);
    },
    showTextPreview(): boolean {
      return this.display === 'file';
    },
    showInput(): boolean {
      return this.display === 'file-input';
    },
    showProgress(): boolean {
      return !!(this.loadingFile && (this.loadingFile as UploadFile).status === 'progress');
    },
    showDelete(): boolean {
      return this.file && (this.file as UploadFile).name && !this.loadingFile;
    },
    inputName(): string {
      const fileName = this.file && (this.file as UploadFile).name;
      const loadingName = this.loadingFile && (this.loadingFile as UploadFile).name;
      return this.showProgress ? loadingName : fileName;
    },
    inputText(): string {
      return this.inputName || this.placeholder;
    },
    inputTextClass(): ClassName {
      return [`${prefix}-input__inner`, { [`${UPLOAD_NAME}__placeholder`]: !this.inputName }];
    },
    classes(): ClassName {
      return [`${UPLOAD_NAME}__single`, `${UPLOAD_NAME}__single-${this.display}`];
    },
  },

  methods: {
    renderProgress() {
      if ((this.loadingFile as UploadFile).status === 'fail') {
        return <ErrorCircleFilledIcon />;
      }

      if (this.showUploadProgress) {
        return (
          <div class={`${UPLOAD_NAME}__single-progress`}>
            <TLoading />
            <span class={`${UPLOAD_NAME}__single-percent`}>
              {Math.min((this.loadingFile as UploadFile).percent, 99)}%
            </span>
          </div>
        );
      }
    },

    renderResult() {
      if (!!this.loadingFile && (this.loadingFile as UploadFile).status === 'fail') {
        return <ErrorCircleFilledIcon />;
      }
      if (this.file && (this.file as UploadFile).name && !this.loadingFile) {
        return <CheckCircleFilledIcon />;
      }
      return '';
    },

    // 文本型预览
    renderFilePreviewAsText() {
      if (!this.inputName) return;
      return (
        <div class={`${UPLOAD_NAME}__single-display-text ${UPLOAD_NAME}__display-text--margin`}>
          <span class={`${UPLOAD_NAME}__single-name`}>{this.inputName}</span>
          {this.showProgress ? (
            this.renderProgress()
          ) : (
            <CloseCircleFilledIcon
              class={`${UPLOAD_NAME}__icon-delete`}
              onClick={({ e }: { e: MouseEvent }) => this.remove(e)}
            />
          )}
        </div>
      );
    },
    // 输入框型预览
    renderFilePreviewAsInput() {
      return (
        <div class={`${UPLOAD_NAME}__single-input-preview ${prefix}-input`}>
          <div class={this.inputTextClass}>
            {<span class={`${UPLOAD_NAME}__single-input-text`}>{abridgeName(this.inputText, 4, 6)}</span>}
            {this.showProgress && this.renderProgress()}
            {this.renderResult()}
          </div>
        </div>
      );
    },
  },

  render() {
    return (
      <div class={this.classes}>
        {this.showInput && this.renderFilePreviewAsInput()}
        {this.$slots.default && this.$slots.default(null)}
        {this.showTextPreview && this.renderFilePreviewAsText()}
      </div>
    );
  },
});
