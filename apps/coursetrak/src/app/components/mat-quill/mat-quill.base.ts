import {
  Directive,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Self,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm,
  Validator,
} from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  CanDisable,
  CanUpdateErrorState,
  ErrorStateMatcher,
  mixinDisabled,
  mixinErrorState,
} from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { QuillEditorBase } from 'ngx-quill';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

// Boilerplate for applying mixins to _MatQuillBase
class MatQuillBase extends QuillEditorBase {
  stateChanges = new Subject<void>();

  constructor(
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl
  ) {
    super();
  }
}

const _MatQuillMixinBase = mixinErrorState(mixinDisabled(MatQuillBase));

@Directive()
export abstract class _MatQuillBase
  extends _MatQuillMixinBase
  implements
    CanDisable,
    CanUpdateErrorState,
    ControlValueAccessor,
    MatFormFieldControl<any>,
    OnChanges,
    OnDestroy,
    Validator
{
  static ngAcceptInputType_disabled: boolean | string | null | undefined;
  static ngAcceptInputType_required: boolean | string | null | undefined;
  abstract controlType: string;
  focused = false;
  abstract id: string;
  @Input()
  override disabled = false;
  @Input()
  override placeholder: string = '';
  @Input()
  override required = false;
  /*
   * GETTERS & SETTERS
   */
  @HostBinding('attr.aria-describedby') _describedBy = '';
  private contentChangedSubscription: Subscription;
  private blurSubscription: Subscription;
  private focusSubscription: Subscription;

  constructor(
    defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional() parentForm: NgForm,
    @Optional() parentFormGroup: FormGroupDirective,
    @Optional() @Self() public override ngControl: NgControl
  ) {
    super(defaultErrorStateMatcher, parentForm, parentFormGroup, ngControl);

    if (!!this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this.contentChangedSubscription = this.onContentChanged
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.updateErrorState();
        this.stateChanges.next();
      });

    this.blurSubscription = this.onBlur.subscribe(() => {
      this.focused = false;
      if (!!this.ngControl && !this.ngControl.control!.touched) {
        this.ngControl.control!.markAsTouched();
        this.updateErrorState();
      }
      this.stateChanges.next();
    });

    this.focusSubscription = this.onFocus.subscribe(() => {
      this.focused = true;
      this.stateChanges.next();
    });
  }

  get empty() {
    return !coerceBooleanProperty(this.value);
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  /*
   * METHODS
   */

  get value(): any {
    try {
      return this.valueGetter(this.quillEditor);
    } catch (e) {
      return;
    }
  }

  set value(value: any) {
    this.writeValue(value);
    this.stateChanges.next();
  }

  override ngOnDestroy() {
    this.contentChangedSubscription.unsubscribe();
    this.blurSubscription.unsubscribe();
    this.focusSubscription.unsubscribe();
    super.ngOnDestroy();
  }

  blur() {
    (this.editorElem.childNodes as NodeListOf<HTMLElement>)[0]['blur']();
  }

  focus() {
    this.quillEditor.focus();
  }

  setDescribedByIds(ids: string[]) {
    this._describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if (!this.focused) {
      this.quillEditor.focus();
    }
  }
}
