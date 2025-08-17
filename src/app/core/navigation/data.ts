/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Tableau de Bord',
        type: 'basic',
        icon: 'heroicons_outline:chart-bar',
        link: '/admin/dashboard',
    },
    {
        id: 'clients',
        title: 'Clients',
        type: 'basic',
        icon: 'heroicons_outline:users',
        link: '/admin/clients',
    },
    {
        id: 'transfers',
        title: 'Virements',
        type: 'basic',
        icon: 'heroicons_outline:arrow-right-circle',
        link: '/admin/transfers',
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Tableau de bord',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/client/dashboard',
    },
    {
        id: 'transfers',
        title: 'Nouveau transfert',
        type: 'basic',
        icon: 'heroicons_outline:arrow-right-circle',
        link: '/client/transfers',
    },
    {
        id: 'beneficiaries',
        title: 'Mes bénéficiaires',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: '/client/beneficiaries',
    },
    {
        id: 'history',
        title: 'Historique',
        type: 'basic',
        icon: 'heroicons_outline:clock',
        link: '/client/history',
    },
    {
        id: 'settings',
        title: 'Paramètres',
        type: 'basic',
        icon: 'heroicons_outline:cog-8-tooth',
        link: '/client/settings',
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Tableau de bord',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/client',
    },
    {
        id: 'transfers',
        title: 'Nouveau transfert',
        type: 'basic',
        icon: 'heroicons_outline:arrow-right-circle',
        link: '/client/transfers',
    },
    {
        id: 'beneficiaries',
        title: 'Mes bénéficiaires',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: '/client/beneficiaries',
    },
    {
        id: 'history',
        title: 'Historique',
        type: 'basic',
        icon: 'heroicons_outline:clock',
        link: '/client/history',
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Tableau de bord',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/client',
    },
    {
        id: 'transfers',
        title: 'Nouveau transfert',
        type: 'basic',
        icon: 'heroicons_outline:arrow-right-circle',
        link: '/client/transfers',
    },
    {
        id: 'beneficiaries',
        title: 'Mes bénéficiaires',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: '/client/beneficiaries',
    },
    {
        id: 'history',
        title: 'Historique',
        type: 'basic',
        icon: 'heroicons_outline:clock',
        link: '/client/history',
    },
];
