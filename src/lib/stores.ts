import { writable } from 'svelte/store';
import type { Component } from 'svelte';

interface NavbarItemsConfig {
    component: Component;
    props?: Record<string, any>;
}

export const navbarItems = writable<NavbarItemsConfig | null>(null);


