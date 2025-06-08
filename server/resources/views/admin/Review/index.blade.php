@extends('admin.layout.master')

@section('title', 'Review Management')
@section('Review_Show', 'active')

@section('content')
    <x-management-table title="Review Management" 
    :headers="['#', 'Product Name EN', 'Product Name AR', 'Rating', 'Comment', 'Customer Name', 'Actions']" 
    :items="$reviews" 
    :Route="'dashboard.review'">
        <x-slot:rows>
            @php($Route = 'dashboard.review')
            @foreach ($reviews as $item)
                <tr>
                    <td>{{ $item->id }}</td>
                    <td>{{ $item->product->name_en }}</td>
                    <td>{{ $item->product->name_ar }}</td>
                    <td>
                        @for ($i = 1; $i <= 5; $i++)
                            <i class="fas fa-star {{ $item->rating >= $i ? 'text-warning' : 'text-muted' }}"></i>
                        @endfor
                    </td>
                    <td>{{ $item->text }}</td>
                    <td>{{ $item->customer->first_name }} {{ $item->customer->last_name }}</td>
                    <td>
                        @if(auth()->user()->hasAnyRole('Admin'))
                        <div class="dropdown">
                            <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="{{ route($Route . '.show', $item->id) }}"><i
                                            class="fas fa-eye"></i> View</a></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li>
                                    <form action="{{ route($Route . '.delete', $item->id) }}" method="POST"
                                        onsubmit="return confirm('Are you sure?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="dropdown-item text-danger"><i
                                                class="fas fa-trash"></i> Delete</button>
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
