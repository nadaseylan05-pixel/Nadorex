function shareLink(url) {
    if (navigator.share) {
        navigator.share({
            title: 'رابط المتجر',
            text: 'تفضل هذا رابط المتجر:',
            url: url
        }).then(() => console.log('تمت المشاركة بنجاح'))
          .catch((error) => console.log('خطأ في المشاركة', error));
    } else {
        alert('المشاركة غير مدعومة في متصفحك');
    }
}