# Kalender Musim Tahunan Gorontalo

&nbsp;

## Demo
Demo [disini](https://zulns.github.io/Kalmustago.js/).

## Dependensi
- [HijriDate.js](https://github.com/ZulNs/HijriDate.js) untuk penggunaan obyek
[`HijriDate`](https://zulns.github.io/HijriDate.js/hijri-date-api-doc.html), librari JS untuk menghitung penanggalan Hijriah
dengan cara yang sama seperti halnya obyek `Date` menghitung penanggalan Masehi.
- [w3css](https://github.com/ZulNs/w3css), diambil dari [CSS Framework](https://github.com/JaniRefsnes/w3css) oleh
[Jan Egil Refsnes](https://github.com/JaniRefsnes) untuk pengaturan tampilan kalender ini. 

## Penggunaan
Cukup tambahkan potongan kode berikut dalam file html anda:

### Cara offline

```html
<div id="kalmus"></div>
<link rel="stylesheet" href="../w3css/w3.css" />
<script type="text/javascript" src="../HijriDate.js/hijri-date.js"></script>
<script type="text/javascript" src="kalmustago.js"></script>
<script type="text/javascript">
    let kmtg = new Kalmustago();
    kmtg.attachTo(document.getElementById('kalmus'));
    // atau gunakan
    // document.getElementById('kalmus').appendChild(kmtg.getElement());
    // kode lainnya
</script>
```

### Atau cara online:

```html
<div id="kalmus"></div>
<link rel="stylesheet" href="https://zulns.github.io/w3css/w3.css" />
<script type="text/javascript" src="https://zulns.github.io/HijriDate.js/hijri-date.js"></script>
<script type="text/javascript" src="https://zulns.github.io/Kalmusgo.js/kalmustago.js"></script>
<script type="text/javascript">
    let kmtg = new Kalmustago();
    kmtg.attachTo(document.getElementById('kalmus'));
    // atau gunakan
    // document.getElementById('kalmus').appendChild(kmtg.getElement());
    // kode lainnya
</script>
```

## Dokumentasi API
Dokumentasi API [disini](kalmustago-api-doc.md).

&nbsp;

&nbsp;

&nbsp;

---
#### Didesain oleh ZulNs
##### @Gorontalo, 5 Mei 2019
---
