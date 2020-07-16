/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { html, LitElement } from 'lit-element';
import {
  applyMixins,
  baseStyles,
  CommonStringsService,
  event,
  EventEmitter,
  property,
  querySlot,
  querySlotAll,
  UniqueId,
  setAttributes,
  syncDefinedProps,
  internalProperty,
} from '@clr/core/internal';
import {
  CdsIcon,
  ClarityIcons,
  timesIcon,
  infoStandardIcon,
  successStandardIcon,
  warningStandardIcon,
  errorStandardIcon,
  helpIcon,
} from '@clr/core/icon';
import { AlertGroupTypes, AlertStatusTypes, AlertSizes } from './alert.interfaces.js';
import { CdsAlertActions } from './alert-actions.element.js';
import { CdsAlertGroup } from './alert-group.element.js';
import { styles } from './alert.element.css.js';

ClarityIcons.addIcons(
  infoStandardIcon,
  errorStandardIcon,
  successStandardIcon,
  warningStandardIcon,
  timesIcon,
  helpIcon
);

export function getIconStatusTuple(status: string): [string, string] {
  const commonstrings = CommonStringsService.keys;

  const statusIcons: { [key: string]: [string, string] } = {
    info: [ClarityIcons.getIconNameFromShape(infoStandardIcon), commonstrings.info],
    success: [ClarityIcons.getIconNameFromShape(successStandardIcon), commonstrings.success],
    warning: [ClarityIcons.getIconNameFromShape(warningStandardIcon), commonstrings.warning],
    danger: [ClarityIcons.getIconNameFromShape(errorStandardIcon), commonstrings.danger],
    unknown: [ClarityIcons.getIconNameFromShape(helpIcon), commonstrings.info],
    loading: ['loading', commonstrings.loading],
  };

  return statusIcons[status] ? statusIcons[status] : statusIcons.info;
}

export function iconShapeIsAlertStatusType(shape: string): boolean {
  const statusShapes = ['info', 'success', 'warning', 'danger', 'unknown'].map(s => {
    return getIconStatusShape(s);
  });
  return statusShapes.indexOf(shape) > -1;
}

export function iconTitleIsAlertStatusLabel(shape: string): boolean {
  const statusLabels = ['info', 'success', 'warning', 'danger', 'unknown'].map(s => {
    return getIconStatusLabel(s);
  });
  return statusLabels.indexOf(shape) > -1;
}

export function getIconStatusShape(status: string): string {
  return getIconStatusTuple(status)[0];
}

export function getIconStatusLabel(status: string): string {
  return getIconStatusTuple(status)[1];
}

export function getAlertContentLayout(
  containerType: 'wrapper' | 'content' | 'actions',
  alertGroupType: AlertGroupTypes,
  alertGroupHasPager: boolean
) {
  const fillLayoutValue = 'align:stretch';

  switch (alertGroupType) {
    case 'light':
      return '';
    case 'banner':
      switch (containerType) {
        case 'wrapper':
          return alertGroupHasPager ? fillLayoutValue : '';
        case 'content':
          return 'align:shrink';
        case 'actions':
          return alertGroupHasPager ? fillLayoutValue : '';
        default:
          return '';
      }
    default:
      switch (containerType) {
        case 'wrapper':
          return fillLayoutValue;
        case 'content':
          return fillLayoutValue;
        case 'actions':
          return 'align:shrink';
        default:
          return '';
      }
  }
}

class AlertMixinClass extends LitElement {}

applyMixins(AlertMixinClass, [UniqueId]);

/**
 * Alerts are banners that communicate a message with a severity attached to it.
 * They grab the user’s attention to provide critical information needed in context.
 *
 * Alerts outside of a cds-alert-group or cds-app-alert-group component will be
 * displayed as a "lightweight alert". Lightweight alerts, by default, provide no
 * close button component and they inherit no status (a.k.a. success, danger, etc.).
 *
 * Alerts inside a cds-alert-group component inherit their status from the containing
 * alert group.
 *
 * Alerts inside a cds-app-alert-group component inherit their status as a default from
 * the containing app-alert group, although it can be overridden on individual alerts.
 *
 * ```typescript
 * import '@clr/core/alert/register.js';
 * ```
 *
 * ```html
 *   <cds-alert>
 *     Single Alert
 *     <cds-alert-actions>
 *       buttons, links
 *     </cds-alert-actions>
 *   </cds-alert>
 * ```
 *
 * @element cds-alert
 * @slot - Content slot for inside the alert
 * @event closeChange - notify when the user has clicked the dismiss button
 * @cssprop --color
 * @cssprop --background
 * @cssprop --border-radius
 * @cssprop --border-color
 * @cssprop --icon-color
 * @cssprop --close-icon-color
 * @cssprop --close-icon-color-hover
 */
export class CdsAlert extends AlertMixinClass {
  @event() private closeChange: EventEmitter<boolean>;

  /**
   * @type {default | sm}
   * Sets the overall height and width of the alert and icon based on value
   */
  @property({ type: String })
  size: AlertSizes = 'default';

  /**
   * Sets up the buttons, layouts, close-button and other properties based on the alert group container
   * Internal Use Only
   * @private
   */
  @internalProperty({ type: String, reflect: true })
  type: AlertGroupTypes = 'light';

  private idForAriaDescriber = 'aria-' + this._idPrefix + this._uniqueId;

  /**
   * If false, the alert will not render the close button.
   *
   * Lightweight alerts do not display close buttons
   */
  @property({ type: Boolean })
  closable = false;

  /**
   * @type {default | info | success | warning | danger | unknown | loading}
   * Sets the color of the alert from a predefined list of statuses
   */
  @property({ type: String })
  status: AlertStatusTypes = 'default';

  @property({ type: String })
  closeIconTitle = CommonStringsService.keys.alertCloseButtonAriaLabel;

  @querySlot('cds-alert-actions') private alertActions: CdsAlertActions;

  @querySlotAll('cds-icon', { assign: 'alert-icon' }) protected alertIcons: NodeListOf<CdsIcon>;

  @querySlot('cds-internal-close-button', { assign: 'close-button' }) protected closeButton: HTMLElement;

  connectedCallback() {
    super.connectedCallback();
    setAttributes(this, ['aria-describedby', this.idForAriaDescriber], ['role', 'region']);
  }

  updated(props: Map<string, any>) {
    super.updated(props);
    syncDefinedProps(props, this, [this.alertActions]);
  }

  private get parentGroupHasPager(): boolean {
    return this.type === 'banner' && !!(this.parentElement as CdsAlertGroup).pager;
  }

  render() {
    return html`
      <div
        class="private-host"
        cds-layout="${this.type === 'banner'
          ? 'horizontal wrap:none gap:sm align:vertical-center align:horizontal-center'
          : 'horizontal wrap:none gap:xs'}"
      >
        ${this.type === 'banner' && !this.parentGroupHasPager
          ? html`<span class="alert-spacer" cds-layout="align:stretch">&nbsp;</span>`
          : html``}
        <span class="alert-icon-wrapper" aria-hidden="true" cds-layout="horizontal">
          ${this.status === 'loading'
            ? html`<span
                class="${this.type === 'banner'
                  ? 'spinner spinner-inline spinner-neutral-0'
                  : 'spinner spinner-inline'}"
                aria-hidden="true"
                cds-layout="align:horizontal-center"
              ></span>`
            : html`<slot name="alert-icon"
                ><cds-icon
                  class="alert-status-icon"
                  shape="${getIconStatusShape(this.status)}"
                  title="${getIconStatusLabel(this.status)}"
                  aria-hidden="true"
                  cds-layout="align:horizontal-center"
                ></cds-icon
              ></slot>`}
        </span>
        <span
          class="alert-content-wrapper"
          cds-layout="horizontal wrap:none ${getAlertContentLayout('wrapper', this.type, this.parentGroupHasPager)}"
        >
          <span
            id="${this.idForAriaDescriber}"
            role="status"
            class="alert-content"
            cds-layout="${getAlertContentLayout('content', this.type, this.parentGroupHasPager)}"
          >
            <slot></slot>
            ${this.type === 'light' ? html`<slot name="actions"></slot>` : html``}
          </span>
          ${this.type === 'light'
            ? html``
            : html`<span
                class="alert-actions-wrapper"
                cds-layout="${this.alertActions ? 'p-l:md' : ''} ${getAlertContentLayout(
                  'actions',
                  this.type,
                  this.parentGroupHasPager
                )}"
                ><slot name="actions"></slot
              ></span>`}
        </span>

        ${this.type === 'banner' && !this.parentGroupHasPager
          ? html`<span class="alert-spacer" cds-layout="align:stretch">&nbsp;</span>`
          : html``}
        ${this.type !== 'light' && this.closable
          ? html`<span class="alert-close-wrapper"
              ><slot name="close-button"
                ><cds-internal-close-button
                  icon-size="${this.type === 'banner' ? '20' : '16'}"
                  @click="${() => this.closeAlert()}"
                  aria-label="${this.closeIconTitle}"
                ></cds-internal-close-button></slot
            ></span>`
          : html``}
      </div>
    `;
  }

  private closeAlert() {
    this.closeChange.emit(true);
  }

  static get styles() {
    return [baseStyles, styles];
  }
}

export interface CdsAlert extends AlertMixinClass, UniqueId {}
