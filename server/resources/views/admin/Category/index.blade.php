@extends('admin.layout.master')

@section('title', 'Category Management')
@section('Categories_Show', 'active')

@section('content')
    <x-management-table
        title="Category Management"
        :headers="[
            '#', 'Name', 'Product count', 'SubCategory count', 'Actions'
        ]"
        :items="$categories"
        :Route="'dashboard.category'"
    >
        <x-slot:rows>
            @php($Route = 'dashboard.category')
            @foreach ($categories as $item)
                <tr>
                    <td>{{ $item->id }}</td>
                    <td>{{ $item->name_ar }}</td>
                    <td>{{ $item->products->count() }}</td>
                    <td>
                        <x-subcategory-popout
                            :subcategories="$subcategories->where('parent_id', $item->id)"
                            :category-id="$item->id"
                            title="Subcategories of {{ $item->name_ar }}"
                        />
                    </td>
                    <td>
                        @if(auth()->user()->hasRole('Admin'))
                        <div class="dropdown">
                            <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="{{ route($Route . '.show', $item->id) }}"><i class="fas fa-eye"></i> View</a></li>
                                <li><a class="dropdown-item" href="{{ route($Route . '.edit', $item->id) }}"><i class="fas fa-edit"></i> Edit</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li>
                                    <form action="{{ route('dashboard.category.destroy', $item->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this category?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="dropdown-item text-danger"><i class="fas fa-trash"></i> Delete</button>
                                    </form>
                                </li>
                            </ul>
                        </div>
                        @else
                        <a href="{{ route($Route . '.show', $item->id) }}"><i class="fas fa-eye"></i> View</a>
                        @endif
                    </td>
                </tr>
            @endforeach
        </x-slot:rows>
    </x-management-table>
@endsection
