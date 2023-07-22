import type { Todo } from "$lib/types/types"

export const toData = (todo: Todo) => {
    return {
        ...todo,
        _id: todo._id.toString(),
    }
}