import { supabase } from "@/utils/supabase";
import {ref} from "vue";

export function useInventory() {
    const inventoryItems = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const fetchInventory = async () => {
        loading.value = true;
        error.value = null;
