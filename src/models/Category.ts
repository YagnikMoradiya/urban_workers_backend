import { model, Schema } from "mongoose";

interface Category {
    name: string;
}

const CategorySchema = new Schema<Category>({
    name: {
        type: String,
        required: true
    }
})

const CategoryModel = model<Category>('Category', CategorySchema)

export default CategoryModel;