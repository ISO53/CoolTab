<template>
    <div class="file-chooser">
        <!-- <input type="file" accept="image/*" @change="handleFileChange" /> -->
        <!-- <p v-if="fileName">Selected file: {{ fileName }}</p> -->
        <!-- <p v-else="fileName">Choose Your Image</p> -->

        <input id="file-input" type="file" accept="image/*" @change="handleFileChange" hidden />

        <label for="file-input">
            <p v-if="!fileName">Choose Your Image</p>
            <p class="filename" v-if="fileName">{{ fileName }}</p>
            <img src="@/components/icons/folder.svg" />
        </label>
    </div>
</template>

<script>
export default {
    name: "FileChooser",
    data() {
        return {
            fileName: null,
        };
    },
    methods: {
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith("image/")) {
                this.fileName = file.name;
            } else {
                this.fileName = null;
            }
        },
    },
};
</script>

<style scoped>
label {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: rgb(20, 20, 20);
    color: rgb(200, 200, 200);
    width: 100%;
    padding: 8px 12px 8px 12px;
    font-family: sans-serif;
    border-radius: 10px;
    cursor: pointer;
    text-align: center;
    border: 2px solid rgb(50, 50, 50);
    transition: color 250ms ease;
}

label:hover {
    color: white;
}

label img {
    transition: filter 250ms ease;
}

label:hover img {
    filter: brightness(150%);
}

.filename {
    width: 80%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
