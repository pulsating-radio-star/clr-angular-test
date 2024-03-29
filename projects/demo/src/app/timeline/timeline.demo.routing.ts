/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TimelineStaticDemo } from './static/timeline-static';
import { TimelineDemo } from './timeline.demo';
import { TimelineAngularDemo } from './angular/timeline-angular';

const ROUTES: Routes = [
  {
    path: '',
    component: TimelineDemo,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'static' },
      { path: 'static', component: TimelineStaticDemo },
      { path: 'angular', component: TimelineAngularDemo },
    ],
  },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
