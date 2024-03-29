/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ClarityModule } from '@clr/angular';

import { TabsAngularDemo } from './tabs-angular';
import { TabsStaticDemo } from './tabs-static';
import { TabsDemo } from './tabs.demo';
import { ROUTING } from './tabs.demo.routing';
import { ClrKeyFocusModule } from '../../../../angular/src/utils/focus/key-focus/key-focus.module';

@NgModule({
  imports: [CommonModule, ClarityModule, ROUTING, ClrKeyFocusModule],
  declarations: [TabsDemo, TabsStaticDemo, TabsAngularDemo],
  exports: [TabsDemo, TabsStaticDemo, TabsAngularDemo],
})
export class TabsDemoModule {}
