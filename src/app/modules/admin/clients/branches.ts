export interface Branch {
    code: string;
    name: string;
    governorate: string;
}

export const TUNISIAN_BRANCHES: Branch[] = [
    // Tunis
    { code: '001', name: 'Tunis Centre', governorate: 'Tunis' },
    { code: '002', name: 'Tunis Medina', governorate: 'Tunis' },
    { code: '003', name: 'Tunis Belvédère', governorate: 'Tunis' },
    { code: '004', name: 'Tunis El Menzah', governorate: 'Tunis' },
    { code: '005', name: 'Tunis Manar', governorate: 'Tunis' },

    // Ariana
    { code: '010', name: 'Ariana Centre', governorate: 'Ariana' },
    { code: '011', name: 'Ariana Soukra', governorate: 'Ariana' },
    { code: '012', name: 'Ariana Raoued', governorate: 'Ariana' },

    // Ben Arous
    { code: '020', name: 'Ben Arous Centre', governorate: 'Ben Arous' },
    { code: '021', name: 'Ezzahra', governorate: 'Ben Arous' },
    { code: '022', name: 'Radès', governorate: 'Ben Arous' },
    { code: '023', name: 'Fouchana', governorate: 'Ben Arous' },

    // Manouba
    { code: '030', name: 'Manouba Centre', governorate: 'Manouba' },
    { code: '031', name: 'Douar Hicher', governorate: 'Manouba' },
    { code: '032', name: 'Oued Ellil', governorate: 'Manouba' },

    // Nabeul
    { code: '040', name: 'Nabeul Centre', governorate: 'Nabeul' },
    { code: '041', name: 'Hammamet', governorate: 'Nabeul' },
    { code: '042', name: 'Kelibia', governorate: 'Nabeul' },
    { code: '043', name: 'Korba', governorate: 'Nabeul' },
    { code: '044', name: 'Menzel Bouzelfa', governorate: 'Nabeul' },

    // Zaghouan
    { code: '050', name: 'Zaghouan Centre', governorate: 'Zaghouan' },
    { code: '051', name: 'El Fahs', governorate: 'Zaghouan' },

    // Bizerte
    { code: '060', name: 'Bizerte Centre', governorate: 'Bizerte' },
    { code: '061', name: 'Bizerte Port', governorate: 'Bizerte' },
    { code: '062', name: 'Menzel Bourguiba', governorate: 'Bizerte' },
    { code: '063', name: 'Mateur', governorate: 'Bizerte' },

    // Béja
    { code: '070', name: 'Béja Centre', governorate: 'Béja' },
    { code: '071', name: 'Medjez el Bab', governorate: 'Béja' },
    { code: '072', name: 'Testour', governorate: 'Béja' },

    // Jendouba
    { code: '080', name: 'Jendouba Centre', governorate: 'Jendouba' },
    { code: '081', name: 'Tabarka', governorate: 'Jendouba' },
    { code: '082', name: 'Ain Draham', governorate: 'Jendouba' },
    { code: '083', name: 'Fernana', governorate: 'Jendouba' },

    // Kef
    { code: '090', name: 'Kef Centre', governorate: 'Kef' },
    { code: '091', name: 'Dahmani', governorate: 'Kef' },
    { code: '092', name: 'Sers', governorate: 'Kef' },

    // Siliana
    { code: '100', name: 'Siliana Centre', governorate: 'Siliana' },
    { code: '101', name: 'Makthar', governorate: 'Siliana' },
    { code: '102', name: 'Rouhia', governorate: 'Siliana' },

    // Sousse
    { code: '110', name: 'Sousse Centre', governorate: 'Sousse' },
    { code: '111', name: 'Sousse Ville', governorate: 'Sousse' },
    { code: '112', name: 'Sousse Sahloul', governorate: 'Sousse' },
    { code: '113', name: 'Hammam Sousse', governorate: 'Sousse' },
    { code: '114', name: 'Msaken', governorate: 'Sousse' },
    { code: '115', name: 'Kalaa Kebira', governorate: 'Sousse' },

    // Monastir
    { code: '120', name: 'Monastir Centre', governorate: 'Monastir' },
    { code: '121', name: 'Monastir Marina', governorate: 'Monastir' },
    { code: '122', name: 'Ksar Hellal', governorate: 'Monastir' },
    { code: '123', name: 'Moknine', governorate: 'Monastir' },
    { code: '124', name: 'Sahline', governorate: 'Monastir' },

    // Mahdia
    { code: '130', name: 'Mahdia Centre', governorate: 'Mahdia' },
    { code: '131', name: 'Ksour Essef', governorate: 'Mahdia' },
    { code: '132', name: 'Chebba', governorate: 'Mahdia' },

    // Sfax
    { code: '140', name: 'Sfax Centre', governorate: 'Sfax' },
    { code: '141', name: 'Sfax Ville', governorate: 'Sfax' },
    { code: '142', name: 'Sfax El Ain', governorate: 'Sfax' },
    { code: '143', name: 'Sfax Sakiet Ezzit', governorate: 'Sfax' },
    { code: '144', name: 'Sfax Thyna', governorate: 'Sfax' },
    { code: '145', name: 'Kerkennah', governorate: 'Sfax' },

    // Kairouan
    { code: '150', name: 'Kairouan Centre', governorate: 'Kairouan' },
    { code: '151', name: 'Kairouan Medina', governorate: 'Kairouan' },
    { code: '152', name: 'Sbikha', governorate: 'Kairouan' },
    { code: '153', name: 'Nasrallah', governorate: 'Kairouan' },

    // Kasserine
    { code: '160', name: 'Kasserine Centre', governorate: 'Kasserine' },
    { code: '161', name: 'Feriana', governorate: 'Kasserine' },
    { code: '162', name: 'Sbeitla', governorate: 'Kasserine' },
    { code: '163', name: 'Thala', governorate: 'Kasserine' },

    // Sidi Bouzid
    { code: '170', name: 'Sidi Bouzid Centre', governorate: 'Sidi Bouzid' },
    { code: '171', name: 'Regueb', governorate: 'Sidi Bouzid' },
    { code: '172', name: 'Jelma', governorate: 'Sidi Bouzid' },
    { code: '173', name: 'Mezzouna', governorate: 'Sidi Bouzid' },

    // Gabès
    { code: '180', name: 'Gabès Centre', governorate: 'Gabès' },
    { code: '181', name: 'Gabès Ville', governorate: 'Gabès' },
    { code: '182', name: 'Mareth', governorate: 'Gabès' },
    { code: '183', name: 'El Hamma', governorate: 'Gabès' },

    // Médenine
    { code: '190', name: 'Médenine Centre', governorate: 'Médenine' },
    { code: '191', name: 'Zarzis', governorate: 'Médenine' },
    { code: '192', name: 'Houmt Souk (Djerba)', governorate: 'Médenine' },
    { code: '193', name: 'Midoun (Djerba)', governorate: 'Médenine' },
    { code: '194', name: 'Ben Gardane', governorate: 'Médenine' },

    // Tataouine
    { code: '200', name: 'Tataouine Centre', governorate: 'Tataouine' },
    { code: '201', name: 'Remada', governorate: 'Tataouine' },
    { code: '202', name: 'Ghomrassen', governorate: 'Tataouine' },

    // Gafsa
    { code: '210', name: 'Gafsa Centre', governorate: 'Gafsa' },
    { code: '211', name: 'Redeyef', governorate: 'Gafsa' },
    { code: '212', name: 'Métlaoui', governorate: 'Gafsa' },
    { code: '213', name: 'Moulares', governorate: 'Gafsa' },

    // Tozeur
    { code: '220', name: 'Tozeur Centre', governorate: 'Tozeur' },
    { code: '221', name: 'Nefta', governorate: 'Tozeur' },
    { code: '222', name: 'Degache', governorate: 'Tozeur' },

    // Kebili
    { code: '230', name: 'Kebili Centre', governorate: 'Kebili' },
    { code: '231', name: 'Douz', governorate: 'Kebili' },
    { code: '232', name: 'Souk Lahad', governorate: 'Kebili' },
];

export function getBranchNameFromCode(
    rib: string | undefined
): string | undefined {
    if (rib) {
        rib = rib.trim();
        const branchCode = rib.substring(2, 5);
        const branch = TUNISIAN_BRANCHES.find(
            (branch) => branch.code === branchCode
        );
        return branch ? branch.name : undefined;
    }
}
