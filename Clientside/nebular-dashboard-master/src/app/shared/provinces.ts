

export interface Province {
    name: string;
    counties: County[];
  }
  
  export interface County {
    name: string;
    subcounties: string[];
  }
  


  export const centralProvince: Province = {
    name: 'Central',
    counties: [
      {
        name: 'Kiambu',
        subcounties: ['Gatanga', 'Githunguri', 'Juja', 'Kabete', 'Kiambaa', 'Kiambu', 'Kikuyu', 'Limuru', 'Lari', 'Ruiru', 'Thika']
      },
      {
        name: 'Muranga',
        subcounties: ['Kiharu', 'Kangema', 'Mathioya', 'Kigumo', 'Maragua', 'Gatanga', 'Kandara']
      },
      {
        name: 'Nyeri',
        subcounties: ['Kieni East', 'Kieni West', 'Mathira East', 'Mathira West', 'Mukurweini', 'Nyeri Town', 'Othaya', 'Tetu']
      },
      {
        name: 'Nyandarua',
        subcounties: ['Kinangop', 'Kipipiri', 'Ndaragwa', 'Ol-Kalou', 'Ol Joro Orok']
      },
      {
        name: 'Kirinyaga',
        subcounties: ['Kirinyaga Central', 'Kirinyaga East', 'Kirinyaga West', 'Mwea East', 'Mwea West']
      },
      {
        name: 'Embu',
        subcounties: ['Manyatta', 'Mbeere North', 'Mbeere South', 'Runyenjes']
      },
      {
        name: 'Tharaka-Nithi',
        subcounties: ['Tharaka North', 'Tharaka South', 'Chuka', 'Igambango\'mbe', 'Maara', 'Chiakariga', 'Muthambi']
      }
    ]
  };


  export const coastProvince: Province = {
    name: 'Coast',
    counties: [
      {
        name: 'Mombasa',
        subcounties: ['Changamwe', 'Jomvu', 'Kisauni', 'Likoni', 'Mvita', 'Nyali']
      },
      {
        name: 'Kwale',
        subcounties: ['Kinango', 'Lunga Lunga', 'Matuga', 'Msambweni']
      },
      {
        name: 'Kilifi',
        subcounties: ['Ganze', 'Kaloleni', 'Kilifi North', 'Kilifi South', 'Magarini', 'Malindi', 'Rabai']
      },
      {
        name: 'Tana River',
        subcounties: ['Bura', 'Galole', 'Garsen']
      },
      {
        name: 'Lamu',
        subcounties: ['Lamu East', 'Lamu West']
      },
      {
        name: 'Taita-Taveta',
        subcounties: ['Mwatate', 'Taveta', 'Voi', 'Wundanyi']
      }
    ]
  };




  export const nairobiProvince: Province = {
    name: 'Nairobi',
    counties: [
      {
        name: 'Nairobi',
        subcounties: ['Dagoretti North', 'Dagoretti South', 'Embakasi Central', 'Embakasi East', 'Embakasi North', 'Embakasi South', 'Embakasi West', 'Kamukunji', 'Kasarani', 'Kibra', 'Lang\'ata', 'Makadara', 'Mathare', 'Roysambu', 'Ruaraka', 'Starehe', 'Westlands']
      }
    ]
  };


  export const northEasternProvince: Province = {
    name: 'North Eastern',
    counties: [
      {
        name: 'Garissa',
        subcounties: ['Daadab', 'Fafi', 'Garissa Township', 'Hulugho', 'Ijara', 'Lagdera', 'Balambala']
      },
      {
        name: 'Wajir',
        subcounties: ['Eldas', 'Tarbaj', 'Wajir East', 'Wajir North', 'Wajir South', 'Wajir West']
      },
      {
        name: 'Mandera',
        subcounties: ['Banissa', 'Lafey', 'Mandera East', 'Mandera North', 'Mandera South', 'Mandera West']
      }
    ]
  };


  export const nyanzaProvince: Province = {
    name: 'Nyanza',
    counties: [
      {
        name: 'Kisumu',
        subcounties: ['Kisumu Central', 'Kisumu East', 'Kisumu West', 'Muhoroni', 'Nyakach', 'Nyando', 'Seme']
      },
      {
        name: 'Siaya',
        subcounties: ['Alego Usonga', 'Bondo', 'Gem', 'Rarieda', 'Ugenya', 'Unguja']
      },
      {
        name: 'Homa Bay',
        subcounties: ['Homabay Town', 'Kabondo', 'Karachwonyo', 'Kasipul', 'Mbita', 'Ndhiwa', 'Rangwe', 'Suba']
      },
      {
        name: 'Migori',
        subcounties: ['Awendo', 'Kuria East', 'Kuria West', 'Mabera', 'Ntimaru', 'Rongo', 'Suna East', 'Suna West', 'Uriri']
      },
      {
        name: 'Kisii',
        subcounties: ['Borabu', 'Manga', 'Masaba North', 'Nyamira North', 'Nyamira South']
      },
      {
        name: 'Nyamira',
        subcounties: ['Borabu', 'Manga', 'Masaba North', 'Nyamira North', 'Nyamira South']
      }
    ]
  };


  export const riftValleyProvince: Province = {
    name: 'Rift Valley',
    counties: [
      {
        name: 'Baringo',
        subcounties: ['Baringo Central', 'Baringo North', 'Baringo South', 'Eldama Ravine', 'Mogotio', 'Tiaty']
      },
      {
        name: 'Bomet',
        subcounties: ['Bomet Central', 'Bomet East', 'Chepalungu', 'Konoin', 'Sotik']
      },
      {
        name: 'Elgeyo-Marakwet',
        subcounties: ['Keiyo North', 'Keiyo South', 'Marakwet East', 'Marakwet West']
      },
      {
        name: 'Kajiado',
        subcounties: ['Isinya', 'Kajiado Central', 'Kajiado North', 'Loitokitok', 'Mashuuru']
      },
      {
        name: 'Kericho',
        subcounties: ['Ainamoi', 'Belgut', 'Bureti', 'Kipkelion East', 'Kipkelion West', 'Soin/Sigowet']
      },
      {
        name: 'Laikipia',
        subcounties: ['Laikipia Central', 'Laikipia East', 'Laikipia North', 'Laikipia West', 'Nyahururu']
      },
      {
        name: 'Nakuru',
        subcounties: ['Bahati', 'Gilgil', 'Kuresoi North', 'Kuresoi South', 'Molo', 'Naivasha', 'Nakuru Town East', 'Nakuru Town West', 'Njoro', 'Rongai', 'Subukia']
      },
      {
        name: 'Nandi',
        subcounties: ['Aldai', 'Chesumei', 'Emgwen', 'Mosop', 'Nandi Hills', 'Tindiret']
      },
      {
        name: 'Narok',
        subcounties: ['Narok East', 'Narok North', 'Narok South', 'Narok West', 'Transmara East', 'Transmara West']
      },
      {
        name: 'Samburu',
        subcounties: ['Samburu East', 'Samburu North', 'Samburu West']
      },
      {
        name: 'Trans-Nzoia',
        subcounties: ['Cherangany', 'Endebess', 'Kiminini', 'Kwanza', 'Saboti']
      },
      {
        name: 'Turkana',
        subcounties: ['Loima', 'Turkana Central', 'Turkana East', 'Turkana North', 'Turkana South']
      },
      {
        name: 'Uasin Gishu',
        subcounties: ['Ainabkoi', 'Kapseret', 'Kesses', 'Moiben', 'Soy', 'Turbo']
      },
      {
        name: 'West Pokot',
        subcounties: ['Central Pokot', 'North Pokot', 'Pokot South', 'West Pokot']
      }
    ]
  };


  export const westernProvince: Province = {
    name: 'Western',
    counties: [
      {
        name: 'Bungoma',
        subcounties: ['Bumula', 'Kabuchai', 'Kanduyi', 'Kimilil', 'Mt Elgon', 'Sirisia', 'Tongaren', 'Webuye East', 'Webuye West']
      },
      {
        name: 'Busia',
        subcounties: ['Budalangi', 'Butula', 'Funyula', 'Nambele', 'Teso North', 'Teso South']
      },
      {
        name: 'Kakamega',
        subcounties: ['Butere', 'Kakamega Central', 'Kakamega East', 'Kakamega North', 'Kakamega South', 'Khwisero', 'Lugari', 'Lukuyani', 'Lurambi', 'Matete', 'Mumias', 'Mutungu', 'Navakholo']
      },
      {
        name: 'Vihiga',
        subcounties: ['Emuhaya', 'Hamisi', 'Luanda', 'Sabatia', 'Vihiga']
      }
    ]
  };


  
