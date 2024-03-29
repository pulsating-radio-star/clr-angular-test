/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SpinnerSizesDemo } from './spinner-sizes';
import { SpinnerTypesDemo } from './spinner-types';
import { SpinnerDemo } from './spinner.demo';
import { SpinnerComponentDemo } from './spinner-component';

const ROUTES: Routes = [
  {
    path: '',
    component: SpinnerDemo,
    children: [
      { path: '', redirectTo: 'spinner-types', pathMatch: 'full' },
      { path: 'spinner-types', component: SpinnerTypesDemo },
      { path: 'spinner-sizes', component: SpinnerSizesDemo },
      { path: 'spinner-component', component: SpinnerComponentDemo },
    ],
  },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
