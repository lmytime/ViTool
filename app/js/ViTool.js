const app = Vue.createApp({
    data() {
        return {
            imageLists: [],
            radioItems: [],
            textItems: [],
            page: {
                imgURL: './cover.jpg',
                name: 'cover.jpg'
            },
            dialog: false,
            dialogVisible: false,
            dialogTableVisible: false,
            dialogUploadVisible: false,
            dialogImageUrl: '',
            dialogImageVisible: false,
            dialogActivateArrowkeys: true,
            dialogActivateYNkeys: true,
            num: 1,
            newType: 'radio',
            newTitle: '',
            upload: '',
            showImage: false,
            newLabel: '',
            label: [],
            colors: [{
                color: '#f56c6c',
                percentage: 20
            },
            {
                color: '#e6a23c',
                percentage: 40
            },
            {
                color: '#5cb87a',
                percentage: 60
            },
            {
                color: '#1989fa',
                percentage: 80
            },
            {
                color: '#6f7ad3',
                percentage: 100
            },
            ]
        }
    },
    computed: {
        ctrlShow() {
            return typeof (this.page.index) !== 'undefined'
        },
        progress() {
            return 100 * (this.page.index + 1) / this.imageLists.length
        },
        listType() {
            if (this.showImage) {
                return 'picture-card'
            } else {
                return 'text'
            }
        }
    },
    methods: {
        log() {
            document.activeElement.blur();
            // console.log(this.fileList);
        },
        // cli
        addItem() {
            if (this.imageLists.length) {
                if (this.newType === 'radio') {
                    this.radioItems.push({
                        label: this.newLabel,
                        title: this.newTitle
                    })
                } else {
                    this.textItems.push({
                        label: this.newLabel,
                        title: this.newTitle
                    })
                }
                this.newType = 'radio'
                this.newTitle = ''
                this.newLabel = ''
                this.dialog = false
            } else {
                ElementPlus.ElMessage('Please add images first...')
            }
        },
        newWarning() {
            if (this.imageLists.length !== 0) {
                ElementPlus.ElMessage('The current image lists will be replaced if you select new images!')
            }
        },
        getFiles(e) {
            if (e.target.files.length !== 0) {
                this.imageLists = e.target.files;
                this.label = []
                this.urlLists = []
                for (const index in this.imageLists) {
                    if (!isNaN(index)) {
                        this.urlLists.push({
                            url: window.URL.createObjectURL(new Blob([this.imageLists[index], { type: 'image/*' }]))
                        })
                        this.label.push({
                            name: this.imageLists[index].name
                        })
                    }
                }
                this.init()
            } else {
                e.target.files = this.imageLists
            }
        },
        update() {
            this.page.imgURL = this.urlLists[this.page.index].url
            this.page.name = this.label[this.page.index].name
        },
        init() {
            this.page.index = 0
            this.update()
        },
        prev() {
            if (this.page.index > 0) {
                this.page.index -= 1
                this.update()
            } else {
                ElementPlus.ElMessage('Here is the first image...')
            }
        },
        next() {
            if (this.page.index < this.imageLists.length - 1) {
                this.page.index += 1
                this.update()
            } else {
                ElementPlus.ElMessage('Here is the final image...')
            }
        },
        download_table_as_csv(table_id, separator = ',') {
            // Select rows from table_id
            var rows = document.querySelectorAll('table#' + table_id + ' tr');
            // Construct csv
            var csv = [];
            for (var i = 0; i < rows.length; i++) {
                var row = [],
                    cols = rows[i].querySelectorAll('td, th');
                for (var j = 0; j < cols.length; j++) {
                    // Clean innertext to remove multiple spaces and jumpline (break csv)
                    var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
                    // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
                    data = data.replace(/"/g, '""');
                    // Push escaped string
                    row.push('"' + data + '"');
                }
                csv.push(row.join(separator));
            }
            var csv_string = csv.join('\n');
            // Download it
            var filename = 'export_' + table_id + '_' + new Date().toLocaleDateString() + '.csv';
            var link = document.createElement('a');
            link.style.display = 'none';
            link.setAttribute('target', '_blank');
            link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        // handleChange(file) {
        //     file.url = window.URL.createObjectURL(file.raw);
        //     this.imageLists.push(file)
        //     this.label.push({
        //         name: file.name
        //     })
        //     this.init()
        //     this.dialogUploadVisible = false
        // }
    },
    mounted() {
        window.onbeforeunload = function () {
            return 0;
        }
        window.addEventListener("keydown", e => {
            // when textarea or input is focused, disable arrow keys
            if (document.activeElement.tagName === 'TEXTAREA') {
                return
            }
            if (document.activeElement.tagName === 'INPUT') {
                return
            }
            if (this.dialogActivateArrowkeys) {
                switch (e.key) {
                    // left up

                    case 'ArrowUp':
                        e.preventDefault();
                        this.prev();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.prev();
                        break;
                    // right down
                    case 'ArrowRight':
                        e.preventDefault();
                        this.next();
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.next();
                        break;
                }
            }
            if (this.dialogActivateYNkeys) {
                switch (e.key) {
                    case 'y':
                        e.preventDefault();
                        try {
                            this.label[this.page.index][this.radioItems[0].label] = 'Yes'
                            console.log(this.label[this.page.index])
                        } catch (err) {
                            ElementPlus.ElMessage('Key y can label yes for your first radio item, please add radio item...')
                        }
                        break;
                    case 'n':
                        e.preventDefault();
                        try {
                            this.label[this.page.index][this.radioItems[0].label] = 'No'
                            console.log(this.label[this.page.index])
                        } catch (err) {
                            ElementPlus.ElMessage('Key n can label no for your first radio item, please add radio item...')
                        }
                        break;
                }
            }
        });
    }
})

app.use(ElementPlus).mount('#app')


// Quick and simple export target #table_id into a csv
function download_table_as_csv(table_id, separator = ',') {
    // Select rows from table_id
    var rows = document.querySelectorAll('table#' + table_id + ' tr');
    // Construct csv
    var csv = [];
    for (var i = 0; i < rows.length; i++) {
        var row = [],
            cols = rows[i].querySelectorAll('td, th');
        for (var j = 0; j < cols.length; j++) {
            // Clean innertext to remove multiple spaces and jumpline (break csv)
            var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
            // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
            data = data.replace(/"/g, '""');
            // Push escaped string
            row.push('"' + data + '"');
        }
        csv.push(row.join(separator));
    }
    var csv_string = csv.join('\n');
    // Download it
    var filename = 'vi_' + table_id + '_' + new Date().toLocaleDateString() + '.csv';
    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}